#!/bin/bash
echo 'Init DATABASE_URL' 
export DATABASE_URL=postgresql://demoUser:demoUserPassword@localhost:5432/graphql-example?schema=public
docker-compose -f docker-compose-test.yml up -d
npx prisma migrate reset --force
jest --silent=false --verbose -t user
docker-compose -f docker-compose-test.yml stop
