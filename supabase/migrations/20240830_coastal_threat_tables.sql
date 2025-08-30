-- Enhanced Risk Assessments table with new coastal threat fields
CREATE TABLE IF NOT EXISTS risk_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region VARCHAR(255) NOT NULL,
  risk_level VARCHAR(50) NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  sea_level DECIMAL(5,2) NOT NULL,
  cyclones INTEGER NOT NULL DEFAULT 0,
  pollution VARCHAR(50) NOT NULL CHECK (pollution IN ('Low', 'Medium', 'High')),
  algal_blooms VARCHAR(50) NOT NULL CHECK (algal_blooms IN ('None', 'Minor', 'Major')),
  illegal_activities VARCHAR(50) NOT NULL CHECK (illegal_activities IN ('None', 'Low', 'High')),
  population_density INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Alert Logs table with source field
CREATE TABLE IF NOT EXISTS alert_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium')),
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  source VARCHAR(50) NOT NULL CHECK (source IN ('Sensor', 'Satellite', 'Manual', 'API')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sensor Data table for real-time monitoring
CREATE TABLE IF NOT EXISTS sensor_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sensor_type VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  value DECIMAL(10,3) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Satellite Data table for remote sensing
CREATE TABLE IF NOT EXISTS satellite_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data_type VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  coordinates JSONB,
  value DECIMAL(10,3),
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Anomaly Detection table for AI/ML results
CREATE TABLE IF NOT EXISTS anomaly_detections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_table VARCHAR(50) NOT NULL,
  source_id UUID NOT NULL,
  anomaly_type VARCHAR(100) NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL,
  threshold_exceeded BOOLEAN DEFAULT FALSE,
  alert_triggered BOOLEAN DEFAULT FALSE,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Logs table for tracking alerts sent
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id UUID REFERENCES alert_logs(id),
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('SMS', 'Email', 'Web', 'Push')),
  recipient VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('Sent', 'Failed', 'Pending')),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Reports table for citizen reporting
CREATE TABLE IF NOT EXISTS community_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_name VARCHAR(255),
  reporter_contact VARCHAR(255),
  threat_type VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Dismissed')),
  verified_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_risk_assessments_region ON risk_assessments(region);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_risk_level ON risk_assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_alert_logs_severity ON alert_logs(severity);
CREATE INDEX IF NOT EXISTS idx_alert_logs_location ON alert_logs(location);
CREATE INDEX IF NOT EXISTS idx_sensor_data_type_location ON sensor_data(sensor_type, location);
CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp ON sensor_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_satellite_data_type ON satellite_data(data_type);
CREATE INDEX IF NOT EXISTS idx_anomaly_detections_source ON anomaly_detections(source_table, source_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_status ON community_reports(status);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_risk_assessments_updated_at BEFORE UPDATE ON risk_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alert_logs_updated_at BEFORE UPDATE ON alert_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_reports_updated_at BEFORE UPDATE ON community_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for demonstration
INSERT INTO sensor_data (sensor_type, location, value, unit) VALUES
('tide_gauge', 'Mumbai Coast', 2.3, 'm'),
('weather_station', 'Chennai Port', 45, 'km/h'),
('pollution_sensor', 'Goa Beach', 8.5, 'ppm'),
('tide_gauge', 'Kolkata Port', 1.8, 'm'),
('weather_station', 'Kochi Harbor', 32, 'km/h');

INSERT INTO risk_assessments (region, risk_level, sea_level, cyclones, pollution, algal_blooms, illegal_activities, population_density) VALUES
('Mumbai Coastal Zone', 'High', 2.3, 3, 'High', 'Minor', 'Low', 15000),
('Chennai Port Area', 'Medium', 1.8, 2, 'Medium', 'None', 'None', 8500),
('Goa Beaches', 'High', 2.1, 1, 'High', 'Major', 'High', 5200),
('Kolkata Sundarbans', 'Medium', 1.9, 4, 'Medium', 'Minor', 'Low', 12000);

INSERT INTO alert_logs (type, severity, location, description, source) VALUES
('Storm Surge', 'Critical', 'Mumbai Coast', 'Severe storm surge warning - immediate evacuation recommended', 'Sensor'),
('Pollution', 'High', 'Goa Beach', 'Chemical pollution levels exceeded safe limits', 'Sensor'),
('Algal Bloom', 'Medium', 'Goa Beach', 'Algal bloom detected in coastal waters', 'Satellite'),
('Cyclone', 'High', 'Chennai Port', 'Cyclone formation detected 200km offshore', 'API');
