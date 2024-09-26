"use client";

// pages/bookingDetail.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  duration,
} from "@mui/material";
import AppBar from "./../../schedules/appbar"

interface BookingDetailProps {
  user: {
    avatar: string;
    name: string;
    address: string;
  };
  booking: {
    venueName: string;
    date: string;
    duration: number; // in minutes
    courseType: "Daily" | "Weekly" | "Monthly" | "One Session";
  };
}

const BookingDetail: React.FC<BookingDetailProps> = ({ user, booking }) => {
  return (
    <Box sx={{ maxWidth: 600, margin: "auto" }}>
      <AppBar />
      <br />
      <Typography variant="h5" gutterBottom align="center">
        Booking Details
      </Typography>
      <br />
      <Card variant="elevation" elevation={3} sx={{ backgroundColor: '#fff', borderRadius: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Avatar src={user.avatar} sx={{ width: 60, height: 60 }} />
        </Box>
        <CardHeader
          title={user.name}
          subheader={user.address}
          sx={{ textAlign: "center" }}
        />
        <CardContent sx={{ padding: 0, margin: 0 }}>
          <List>
            <ListItem>
              <ListItemText primary="Venue" secondary={booking.venueName} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Start Date" secondary={booking.date} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Duration"
                secondary={booking.duration + " Minutes"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Course Type"
                secondary={booking.courseType}
              />
            </ListItem>
          </List>
        </CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-around", p: 2 }}>
          <Button variant="outlined" color="error">
            Reject
          </Button>
          <Button variant="outlined" color="secondary">
            Reschedule
          </Button>
          <Button variant="contained" color="primary">
            Accept
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

const Detail: React.FC = () => {
  const user = {
    avatar: "https://example.com/avatar.jpg",
    name: "John Doe",
    address: "123 Main St, Anytown, USA",
  };

  const booking = {
    venueName: "Gor Oyudha, Cicurug",
    date: "2024-09-30",
    courseType: "One Session",
    duration: 120,
  };

  return <BookingDetail user={user} booking={booking} />;
};

export default Detail;
