set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
	"userId" serial NOT NULL,
	"firstName" TEXT NOT NULL,
	"lastName" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"password" TEXT NOT NULL,
	"accessToken" TEXT,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "accounts" (
	"plaidId" integer NOT NULL,
	"userId" integer NOT NULL,
	"accountName" TEXT NOT NULL,
	"type" TEXT NOT NULL,
	"balance" integer NOT NULL,
	CONSTRAINT "accounts_pk" PRIMARY KEY ("plaidId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "transactions" (
	"transactionId" serial NOT NULL,
	"userId" integer NOT NULL,
	"name" TEXT NOT NULL,
	"date" DATE NOT NULL,
	"amount" integer NOT NULL,
	"category" TEXT NOT NULL,
	"included" BOOLEAN NOT NULL,
	CONSTRAINT "transactions_pk" PRIMARY KEY ("transactionId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "budgets" (
	"budgetId" serial NOT NULL,
	"createdBy" integer NOT NULL,
	"date" DATE NOT NULL,
	"income" integer NOT NULL,
	"savings" integer NOT NULL,
	"spendingBudget" integer NOT NULL,
	CONSTRAINT "budgets_pk" PRIMARY KEY ("budgetId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "budgetCategories" (
	"itemId" serial NOT NULL,
	"budgetId" integer NOT NULL,
	"category" serial NOT NULL,
	"amount" serial NOT NULL,
	CONSTRAINT "budgetCategories_pk" PRIMARY KEY ("itemId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "accounts" ADD CONSTRAINT "accounts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "budgets" ADD CONSTRAINT "budgets_fk0" FOREIGN KEY ("createdBy") REFERENCES "users"("userId");

ALTER TABLE "budgetCategories" ADD CONSTRAINT "budgetCategories_fk0" FOREIGN KEY ("budgetId") REFERENCES "budgets"("budgetId");
