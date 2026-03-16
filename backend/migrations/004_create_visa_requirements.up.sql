-- 004_create_visa_requirements.up.sql
CREATE TABLE IF NOT EXISTS visa_requirements (
    visa_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_country_id UUID NOT NULL REFERENCES countries(country_id),
    destination_country_id UUID NOT NULL REFERENCES countries(country_id),
    visa_type visa_type_enum NOT NULL,
    description TEXT,
    cost_usd DECIMAL(10,2),
    valid_days INT,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (source_country_id, destination_country_id)
);
