const { Users } = require("../models");

const usersData = [
  {
    user_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    first_name: "Sarah",
    last_name: "Mitchell",
    email: "sarah.mitchell@email.com",
    password: "Password_1",
  },
  {
    user_id: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
    first_name: "Marcus",
    last_name: "Chen",
    email: "marcus.chen@email.com",
    password: "Password_2",
  },
  {
    user_id: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
    first_name: "Emily",
    last_name: "Rodriguez",
    email: "emily.rodriguez@email.com",
    password: "Password_3",
  },
  {
    user_id: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
    first_name: "James",
    last_name: "O'Brien",
    email: "james.obrien@email.com",
    password: "Password_4",
  },
  {
    user_id: "e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b",
    first_name: "Aisha",
    last_name: "Patel",
    email: "aisha.patel@email.com",
    password: "Password_5",
  },
];

const seedUsers = () => Users.bulkCreate(usersData);

module.exports = seedUsers;
