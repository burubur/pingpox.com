import Content from "../../components/contentdefault";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Divider,
  CardActions,
  IconButton,
  Box,
} from "@mui/material";
import { Share, Favorite } from "@mui/icons-material";

interface Coach {
  id: number;
  name: string;
  photoUrl: string;
  expertise: string;
  playingStyle?: string;
  achievements?: string[];
  bio?: string; // Optional field for a short biography
  contactInfo?: {
    email?: string;
    phone?: string;
    socialMedia?: {
      twitter?: string;
      instagram?: string;
      [key: string]: string | undefined; // Additional social media handles
    };
  };
  availability?: string; // E.g., "Weekdays, 9 AM - 5 PM"
  location?: string; // E.g., "Jakarta, Indonesia"
}

// show: national coaches, div 5 coaches,
export default function Coach() {
  let coaches: Coach[] = [
    {
      id: 1,
      name: "Andi Pratama",
      photoUrl: "/coach-1.png",
      expertise: "Advanced Techniques and Strategy",
      achievements: ["National Champion 2018", "SEA Games Gold Medalist 2019"],
      bio: "Andi has over a decade of experience coaching at the national level. He specializes in advanced techniques and strategic play.",
      contactInfo: {
        email: "andi.pratama@example.com",
        phone: "+62 812-3456-7890",
        socialMedia: {
          twitter: "https://twitter.com/andipratama",
          instagram: "https://instagram.com/andipratama",
        },
      },
      availability: "Weekdays, 9 AM - 6 PM",
      location: "Jakarta, Indonesia",
    },
    {
      id: 2,
      name: "Budi Santoso",
      photoUrl: "/coach-2.png",
      expertise: "Youth Development and Coaching",
      achievements: [
        "Junior National Champion 2016",
        "Regional Champion Coach 2018",
      ],
      bio: "Budi is passionate about youth development and has been instrumental in nurturing young talent.",
      contactInfo: {
        email: "budi.santoso@example.com",
        phone: "+62 813-4567-8910",
      },
      availability: "Weekdays, 8 AM - 3 PM",
      location: "Surabaya, Indonesia",
    },
    {
      id: 3,
      name: "Siti Nurbaya",
      photoUrl: "/coach-3.png",
      expertise: "Mental Conditioning and Game Psychology",
      achievements: [
        "World Championship Semi-finalist 2020",
        "National Coach of the Year 2021",
      ],
      bio: "Siti specializes in mental conditioning and game psychology, helping players develop a strong mental edge.",
      contactInfo: {
        email: "siti.nurbaya@example.com",
        socialMedia: {
          instagram: "https://instagram.com/sitinurbaya",
        },
      },
      availability: "Weekends, 10 AM - 4 PM",
      location: "Bandung, Indonesia",
    },
    {
      id: 4,
      name: "Rizky Setiawan",
      photoUrl: "/coach-4.png",
      expertise: "Technical Skills and Speed Training",
      achievements: [
        "National Junior Coach 2021",
        "Youth Olympic Medalist 2020",
      ],
      bio: "Rizky is a young and enthusiastic coach specializing in technical skills and speed training.",
      contactInfo: {
        email: "rizky.setiawan@example.com",
        phone: "+62 814-5678-9101",
        socialMedia: {
          twitter: "https://twitter.com/rizkysetiawan",
        },
      },
      availability: "Weekdays, 10 AM - 4 PM",
      location: "Yogyakarta, Indonesia",
    },
  ];

  return (
    <div>
      <CoachBanner />
      <br />
      <Grid
        container
        spacing={4}
        sx={{ paddingLeft: "24px", paddingRight: "24px" }}
      >
        {coaches.map((coach) => (
          <Grid item xs={12} sm={6} md={3} key={coach.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={coach.photoUrl}
                alt={coach.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {coach.name}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  {coach.expertise}
                </Typography> */}
                <Typography variant="body2" color="text.secondary">
                  {coach.bio}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                Achievements: {coach.achievements.join(", ")}
              </Typography> */}
                <br />
                <Typography variant="body2" color="text.secondary">
                  Location: {coach.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Availability: {coach.availability}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  sx={{ minWidth: "100px" }}
                >
                  Book
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Box>
                  <IconButton aria-label="share">
                    <Share />
                  </IconButton>
                  <IconButton aria-label="add to favorites">
                    <Favorite />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

const CoachBanner = () => {
  return (
    <Box
      sx={{
        position: "relative",
        height: "400px",
        backgroundColor: "black",
        backgroundImage: "url(/banner-coaches.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Latihan Dengan Para Pelatih Professional
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Tingkatkan permainan Anda dengan pelatihan dan bimbingan terbaik.
        </Typography>
      </Box>
    </Box>
  );
};
