-- Remove demo accounts that were seeded with known password hashes in 001.
delete from auth_sessions
where account_id in ('acc-super', 'acc-trainer', 'acc-manager', 'acc-member');

delete from accounts
where id in ('acc-super', 'acc-trainer', 'acc-manager', 'acc-member')
   or email in (
     'owner@pingpox.com',
     'trainer@pingpox.com',
     'events@pingpox.com',
     'member@pingpox.com'
   );
