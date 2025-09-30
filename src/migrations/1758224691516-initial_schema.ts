import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1758224691516 implements MigrationInterface {
  name = 'InitialSchema1758224691516';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enums first
    await queryRunner.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transactions_type_enum') THEN
              CREATE TYPE "public"."Transactions_type_enum" AS ENUM('income', 'expense');
          END IF;
      END$$;
      `);
    await queryRunner.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_status_enum') THEN
              CREATE TYPE "public"."Users_status_enum" AS ENUM('active', 'inactive');
          END IF;
      END$$;
      `);

    // Create tables
    await queryRunner.query(
      `CREATE TABLE "Transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "amount" numeric(10,2) NOT NULL, "type" "public"."Transactions_type_enum" NOT NULL, "categoryId" uuid, "transactionDate" TIMESTAMP NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7761bf9766670b894ff2fdb3700" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_537b5c00afe7427c4fc9434cd59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying, "phone" character varying NOT NULL, "password" character varying NOT NULL, "status" "public"."Users_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "UQ_f0444b8b5c111257c300932ae06" UNIQUE ("phone"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Transactions" ADD CONSTRAINT "FK_f01450fedf7507118ad25dcf41e" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Transactions" ADD CONSTRAINT "FK_7fd01b115723d6d88b160fa740a" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Categories" ADD CONSTRAINT "FK_8111f8d3e5f088377ee14b36a9f" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Categories" DROP CONSTRAINT "FK_8111f8d3e5f088377ee14b36a9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Transactions" DROP CONSTRAINT "FK_7fd01b115723d6d88b160fa740a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Transactions" DROP CONSTRAINT "FK_f01450fedf7507118ad25dcf41e"`,
    );
    await queryRunner.query(`DROP TABLE "Users"`);
    await queryRunner.query(`DROP TABLE "Categories"`);
    await queryRunner.query(`DROP TABLE "Transactions"`);

    // Drop enums last
    await queryRunner.query(`DROP TYPE "public"."Users_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."Transactions_type_enum"`);
  }
}
