"use client";

// import React from "react";

// export default function () {
//   return <div>List of bookings</div>;
// }

// components/BookingRequests.tsx
import React, { useState } from "react";

import AppBar from "./../schedules/appbar";

import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface BookingRequest {
  id: number;
  name: string;
  date: string;
}

interface BookingRequestsProps {
  requests: BookingRequest[];
  onAccept: (id: number) => void;
}

const BookingRequests = ({ requests, onAccept }: BookingRequestsProps) => {
  return (
    <Box>
      <AppBar />
      <Typography variant="h5" align="center">
        Bookings
      </Typography>
      <List>
        {requests.map((request) => (
          <ListItem
            key={request.id}
            secondaryAction={
              <IconButton
                color="default"
                size="medium"
                edge="end"
                aria-label="accept"
                onClick={() => onAccept(request.id)}
              >
                <CheckCircleIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={<Typography variant="body1">{request.name}</Typography>}
              secondary={
                <Typography variant="body2">{request.date}</Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const initialRequests = [
  { id: 1, name: "John Doe", date: "2024-09-27" },
  { id: 2, name: "Jane Smith", date: "2024-09-28" },
  { id: 3, name: "Bruce Wayne", date: "2024-09-28" },
  { id: 4, name: "Foo Bar", date: "2024-09-28" },
];

const Bookings: React.FC = () => {
  const [requests, setRequests] = useState(initialRequests);

  const handleAccept = (id: number) => {
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== id)
    );
    // Add your logic to handle the accepted request here
  };

  return (
    <div>
      <BookingRequests requests={requests} onAccept={handleAccept} />
    </div>
  );
};

export default Bookings;
