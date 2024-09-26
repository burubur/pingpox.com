"use client";

import React from "react";
import {
  styled,
  Box,
  Paper,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Restaurant,
  SportsTennis,
  WifiOff,
  DateRange,
  BeachAccess,
  Coffee,
} from "@mui/icons-material";
import CustomAppBar from "./../schedules/appbar";

const CustomPaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
}));

const ByDay = () => {
  return (
    <Box>
      <Typography variant="subtitle1" align="left">
        Days
      </Typography>
      <CustomPaper variant="elevation" elevation={3}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DateRange />
            </ListItemIcon>
            <ListItemText primary="Saturday - Sunday" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DateRange />
            </ListItemIcon>
            <ListItemText primary="Monday, Wednesday, Thursday" />
          </ListItemButton>
        </ListItem>
      </CustomPaper>
    </Box>
  );
};

const ByHour = () => {
  return (
    <Box>
      <CustomPaper variant="elevation" elevation={3}>
        <CustomAppBar />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SportsTennis />
            </ListItemIcon>
            <ListItemText primary="08:00 - 12:00" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Restaurant />
            </ListItemIcon>
            <ListItemText primary="12:00 - 13:00" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SportsTennis />
            </ListItemIcon>
            <ListItemText primary="13:00 - 16:00" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Coffee />
            </ListItemIcon>
            <ListItemText primary="16:00 - 19:00" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SportsTennis />
            </ListItemIcon>
            <ListItemText primary="19:00 - 21:00" />
          </ListItemButton>
        </ListItem>
      </CustomPaper>
    </Box>
  );
};

const LeavePlan = () => {
  return (
    <CustomPaper variant="elevation" elevation={3}>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <WifiOff />
          </ListItemIcon>
          <ListItemText primary="Saturday, 26 January 2025" />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <BeachAccess />
          </ListItemIcon>
          <ListItemText primary="Sunday, 27 January 2025" />
        </ListItemButton>
      </ListItem>
    </CustomPaper>
  );
};

export default () => {
  return (
    <div>
      <Typography variant="h5" align="center">
        Working Hours
      </Typography>
      <Box textAlign={"center"} margin={2}>
        <ByDay />
        <br />
        <Typography variant="subtitle1" align="left">
          Hours
        </Typography>
        <ByHour />
        <br />
        <Typography variant="subtitle1" align="left">
          Leave Plan
        </Typography>
        <LeavePlan />
      </Box>
    </div>
  );
};
