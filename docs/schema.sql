DROP DATABASE IF EXISTS genosentinel;
CREATE DATABASE genosentinel;
USE genosentinel;

-- MICROSERVICIO CLÍNICA

CREATE TABLE patients (
                          id CHAR(36) PRIMARY KEY,
                          first_name VARCHAR(100) NOT NULL,
                          last_name VARCHAR(100) NOT NULL,
                          birth_date DATE NOT NULL,
                          gender ENUM('Masculino', 'Femenino', 'Otro') NOT NULL,
                          status ENUM('Activo', 'Seguimiento', 'Inactivo') DEFAULT 'Activo',
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tumor_types (
                             id INT AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(200) NOT NULL,
                             system_affected VARCHAR(100) NOT NULL,
                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                             UNIQUE KEY (name)
);

CREATE TABLE clinical_records (
                                  id CHAR(36) PRIMARY KEY,
                                  patient_id CHAR(36) NOT NULL,
                                  tumor_type_id INT NOT NULL,
                                  diagnosis_date DATE NOT NULL,
                                  stage VARCHAR(10) NOT NULL,
                                  treatment_protocol TEXT NOT NULL,
                                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                  FOREIGN KEY (patient_id) REFERENCES patients(id),
                                  FOREIGN KEY (tumor_type_id) REFERENCES tumor_types(id)
);

-- MICROSERVICIO GENÓMICA

CREATE TABLE genes (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       symbol VARCHAR(20) NOT NULL,
                       full_name VARCHAR(200) NOT NULL,
                       function_summary TEXT NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       UNIQUE KEY (symbol)
);

CREATE TABLE genetic_variants (
                                  id CHAR(36) PRIMARY KEY,
                                  gene_id INT NOT NULL,
                                  chromosome VARCHAR(10) NOT NULL,
                                  position BIGINT NOT NULL,
                                  reference_base VARCHAR(500) NOT NULL,
                                  alternate_base VARCHAR(500) NOT NULL,
                                  impact ENUM('Missense', 'Nonsense', 'Frameshift', 'Silent', 'Splice Site', 'Otros') NOT NULL,
                                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                  FOREIGN KEY (gene_id) REFERENCES genes(id)
);

CREATE TABLE patient_variant_reports (
                                         id CHAR(36) PRIMARY KEY,
                                         patient_id CHAR(36) NOT NULL,
                                         variant_id CHAR(36) NOT NULL,
                                         detection_date DATE NOT NULL,
                                         allele_frequency DECIMAL(5,4) NOT NULL,
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                         FOREIGN KEY (variant_id) REFERENCES genetic_variants(id),
                                         CHECK (allele_frequency >= 0 AND allele_frequency <= 1)
);

-- MICROSERVICIO AUTENTICACIÓN

CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(20) DEFAULT 'USER',
                       enabled BOOLEAN DEFAULT TRUE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- DATOS INICIALES

INSERT INTO tumor_types (name, system_affected) VALUES
                                                    ('Cáncer de Mama', 'Glándulas Mamarias'),
                                                    ('Cáncer de Pulmón', 'Sistema Respiratorio'),
                                                    ('Cáncer de Colon', 'Sistema Digestivo'),
                                                    ('Cáncer de Próstata', 'Sistema Reproductivo'),
                                                    ('Leucemia Mieloide Aguda', 'Sistema Hematológico');

INSERT INTO genes (symbol, full_name, function_summary) VALUES
                                                            ('BRCA1', 'Breast Cancer Gene 1', 'Gen supresor de tumores involucrado en reparación del ADN'),
                                                            ('BRCA2', 'Breast Cancer Gene 2', 'Gen supresor de tumores involucrado en reparación del ADN'),
                                                            ('TP53', 'Tumor Protein P53', 'Gen supresor de tumores, guardián del genoma'),
                                                            ('KRAS', 'Kirsten Rat Sarcoma Viral Oncogene', 'Oncogen involucrado en señalización celular'),
                                                            ('EGFR', 'Epidermal Growth Factor Receptor', 'Receptor tirosina quinasa involucrado en proliferación celular');