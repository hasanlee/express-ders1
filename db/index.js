const { faker } = require("@faker-js/faker/locale/az");
const getAge = require("get-age");
const employees = [];
for (let i = 0; i < 10; i++) {
  employees.push({
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    age: getAge(faker.date.birthdate()),
  });
}

const db = {
  employees,
};
module.exports = { db };
