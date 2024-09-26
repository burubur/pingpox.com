"use client";

import React from "react";
import {
  styled,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Star as StarIcon,
  Restaurant,
  SportsTennis,
  WifiOff,
  DateRange,
  BeachAccess,
} from "@mui/icons-material";
import CustomAppBar from "./../schedules/appbar"

const CustomPaper = styled(Paper)(({ theme }) => ({
  //   padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "center",
}));

const Hourly = () => {
  return (
    <Box>
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
            <Restaurant />
          </ListItemIcon>
          <ListItemText primary="16:00 - 17:00" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <SportsTennis />
          </ListItemIcon>
          <ListItemText primary="19:00 - 20:00" />
        </ListItemButton>
      </ListItem>
    </Box>
  );
};

export default () => {
  return (
    <div>
      <Typography variant="h5" align="center">
        Working Hours
      </Typography>
      <Box textAlign={"center"} margin={2}>
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
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DateRange />
              </ListItemIcon>
              <ListItemText primary="Monday, Wednesday, Thursday" />
            </ListItemButton>
          </ListItem>
        </CustomPaper>
        <br />
        <Typography variant="subtitle1" align="left">
          Hours
        </Typography>
        <CustomPaper variant="elevation" elevation={3}>
          <Hourly />
        </CustomPaper>
        <br />
        <Typography variant="subtitle1" align="left">
          Leave Plan
        </Typography>
        <CustomPaper variant="elevation" elevation={3}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <WifiOff />
              </ListItemIcon>
              <ListItemText primary="Saturday, 26 January 2025" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <BeachAccess />
              </ListItemIcon>
              <ListItemText primary="Sunday, 27 January 2025" />
            </ListItemButton>
          </ListItem>
        </CustomPaper>
      </Box>
    </div>
  );
};
