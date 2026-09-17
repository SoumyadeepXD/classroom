-- V2__add_submission_receipt_code.sql
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS receipt_code VARCHAR(100);
