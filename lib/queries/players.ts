import { sql, sqlOne } from "@/lib/db";
import { newId } from "@/lib/id";
import type { PlayerGender, PlayerRecord } from "@/domain/players";

type PlayerRow = {
  id: string;
  name: string;
  club: string | null;
  gender: PlayerGender;
  birth_year: number;
  ranking: number;
  province: string;
  city: string;
  district: string | null;
  subdistrict: string | null;
  postal_code: string | null;
};

function mapPlayer(row: PlayerRow): PlayerRecord {
  return {
    id: row.id,
    name: row.name,
    club: row.club,
    gender: row.gender,
    birthYear: row.birth_year,
    ranking: row.ranking,
    province: row.province,
    city: row.city,
    district: row.district,
    subdistrict: row.subdistrict,
    postalCode: row.postal_code,
  };
}

export async function listPlayers(): Promise<PlayerRecord[]> {
  const rows = await sql<PlayerRow>(
    `select id, name, club, gender, birth_year, ranking, province, city, district, subdistrict, postal_code
     from players order by ranking asc, name asc`,
  );
  return rows.map(mapPlayer);
}

export async function getPlayer(id: string): Promise<PlayerRecord | null> {
  const row = await sqlOne<PlayerRow>(
    `select id, name, club, gender, birth_year, ranking, province, city, district, subdistrict, postal_code
     from players where id = $1`,
    [id],
  );
  return row ? mapPlayer(row) : null;
}

export async function createPlayer(input: {
  name: string;
  club?: string;
  gender: PlayerGender;
  birthYear: number;
  ranking: number;
  province: string;
  city: string;
  district?: string;
  subdistrict?: string;
  postalCode?: string;
}): Promise<PlayerRecord> {
  const id = newId("p");
  await sql(
    `insert into players (id, name, club, gender, birth_year, ranking, province, city, district, subdistrict, postal_code)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      id,
      input.name,
      input.club ?? null,
      input.gender,
      input.birthYear,
      input.ranking,
      input.province,
      input.city,
      input.district ?? null,
      input.subdistrict ?? null,
      input.postalCode ?? null,
    ],
  );
  return (await getPlayer(id))!;
}

export async function updatePlayer(
  id: string,
  input: Partial<{
    name: string;
    club: string | null;
    gender: PlayerGender;
    birthYear: number;
    ranking: number;
    province: string;
    city: string;
    district: string | null;
    subdistrict: string | null;
    postalCode: string | null;
  }>,
): Promise<void> {
  const current = await getPlayer(id);
  if (!current) throw new Error("Player not found");
  await sql(
    `update players set name=$1, club=$2, gender=$3, birth_year=$4, ranking=$5,
      province=$6, city=$7, district=$8, subdistrict=$9, postal_code=$10
     where id=$11`,
    [
      input.name ?? current.name,
      input.club === undefined ? current.club : input.club,
      input.gender ?? current.gender,
      input.birthYear ?? current.birthYear,
      input.ranking ?? current.ranking,
      input.province ?? current.province,
      input.city ?? current.city,
      input.district === undefined ? current.district : input.district,
      input.subdistrict === undefined ? current.subdistrict : input.subdistrict,
      input.postalCode === undefined ? current.postalCode : input.postalCode,
      id,
    ],
  );
}

export async function playerMatchHistory(playerId: string) {
  return sql<{
    event_id: string;
    event_title: string;
    stage: string;
    opponent: string;
    score: string;
    result: string;
  }>(
    `select e.id as event_id, e.title as event_title, m.stage,
      case when m.player_a_id = $1 then pb.name else pa.name end as opponent,
      coalesce(m.score_a::text || '-' || m.score_b::text, '-') as score,
      case
        when m.winner_id is null then 'pending'
        when m.winner_id = $1 then 'win'
        else 'loss'
      end as result
     from matches m
     join events e on e.id = m.event_id
     left join players pa on pa.id = m.player_a_id
     left join players pb on pb.id = m.player_b_id
     where m.player_a_id = $1 or m.player_b_id = $1
     order by m.created_at desc
     limit 20`,
    [playerId],
  );
}
