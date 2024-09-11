// This file contains all endpoints regarding Badges
// Author: Daniel Manley

// Requirements
const express = require("express");
const router = express.Router();
const { Query } = require("firefose");
const Badge = require("../models/badge");