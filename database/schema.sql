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
	"account_id" TEXT NOT NULL,
	"userId" integer NOT NULL,
	"name" TEXT NOT NULL,
	"subtype" TEXT NOT NULL,
	"balances" DECIMAL NOT NULL,
	CONSTRAINT "accounts_pk" PRIMARY KEY ("account_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "transactions" (
	"transactionId" TEXT NOT NULL,
	"userId" integer NOT NULL,
	"name" TEXT NOT NULL,
	"date" TEXT NOT NULL,
	"month" TEXT NOT NULL,
	"year" integer NOT NULL,
	"amount" DECIMAL NOT NULL,
	"category" TEXT,
	CONSTRAINT "transactions_pk" PRIMARY KEY ("transactionId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "budgets" (
	"budgetId" integer NOT NULL,
	"createdBy" integer NOT NULL,
	"income" DECIMAL NOT NULL,
	"savings" DECIMAL NOT NULL,
	"static" DECIMAL NOT NULL,
	CONSTRAINT "budgets_pk" PRIMARY KEY ("budgetId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "budgetCategories" (
	"itemId" integer NOT NULL,
	"createdBy" integer NOT NULL,
	"food" integer NOT NULL,
	"travel" integer NOT NULL,
	"entertainment" integer NOT NULL,
	"healthcare" integer NOT NULL,
	"personal" integer NOT NULL,
	"education" integer NOT NULL,
	"services" integer NOT NULL,
	"Misc" integer NOT NULL,
	CONSTRAINT "budgetCategories_pk" PRIMARY KEY ("itemId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "accounts" ADD CONSTRAINT "accounts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "budgets" ADD CONSTRAINT "budgets_fk0" FOREIGN KEY ("createdBy") REFERENCES "users"("userId");

ALTER TABLE "budgetCategories" ADD CONSTRAINT "budgetCategories_fk0" FOREIGN KEY ("createdBy") REFERENCES "budgets"("createdBy");
