CREATE TABLE "vehicles" (
	"id" serial PRIMARY KEY,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"type" text NOT NULL,
	"fuel" text NOT NULL,
	"engine_cc" integer,
	"motor_kw" integer,
	"mileage" integer NOT NULL,
	"color" text NOT NULL,
	"transmission" text NOT NULL,
	"price" integer NOT NULL,
	"image" text DEFAULT '/placeholder.png' NOT NULL,
	"features" text DEFAULT '[]' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'Available' NOT NULL,
	"grade" text DEFAULT '' NOT NULL
);

-- Seed initial vehicle inventory
INSERT INTO "vehicles" ("make","model","year","type","fuel","engine_cc","motor_kw","mileage","color","transmission","price","image","features","description","status","grade") VALUES
('Toyota','Aqua (Prius C) G Grade',2023,'Hatchback','Hybrid',1500,NULL,8200,'Pearl White','CVT',9800000,'/placeholder.png','["Reverse Camera","Smart Key & Push Start","LED Headlights","Radar Cruise Control","Lane Departure Alert","Pre-Collision System","Apple CarPlay"]','The latest generation Toyota Aqua hybrid — Japan''s best-selling compact hybrid with outstanding fuel economy of 35 km/L. Brand new import direct from Japan with full factory warranty documentation.','Available','G'),
('Honda','Vezel e:HEV Z',2022,'SUV','Hybrid',1500,NULL,14500,'Sonic Grey Pearl','CVT',13200000,'/placeholder.png','["Panoramic Sunroof","Honda SENSING Suite","Wireless Apple CarPlay & Android Auto","Heated Front Seats","LED Ambient Lighting","18-inch Alloy Wheels","360° Camera"]','The redesigned Honda Vezel e:HEV delivers a perfect blend of sportiness and efficiency. Spacious interior with premium features and Honda SENSING safety suite. Direct import from Japan.','Available','Z'),
('Toyota','Land Cruiser Prado TX-L',2021,'SUV','Diesel',2800,NULL,32000,'Attitude Black Mica','Automatic',28500000,'/placeholder.png','["Multi-terrain Select","Kinetic Dynamic Suspension","Crawl Control","Premium Leather Interior","9-inch Touchscreen","JBL 14-Speaker Audio","Electronic Rear Differential Lock"]','Legendary Toyota Land Cruiser Prado in immaculate condition. The 2.8L diesel engine delivers commanding off-road capability with refined on-road comfort. Perfect for Sri Lankan terrain.','Available','TX-L'),
('Suzuki','Alto VP',2023,'Hatchback','Petrol',660,NULL,3100,'Speedy Blue','Automatic',4200000,'/placeholder.png','["Idle Stop System","Rear Parking Sensors","Remote Central Locking","Power Steering","Air Conditioning","Dual Airbags","ABS Brakes"]','Near-new Suzuki Alto — the ideal city car for Sri Lanka. Exceptional fuel economy, compact dimensions for easy parking, and ultra-low running costs. Brand new import.','Available','VP'),
('Toyota','Premio X EX Package',2020,'Sedan','Petrol',1800,NULL,41000,'Super White II','CVT',11500000,'/placeholder.png','["EX Package Full Leather","Navigation System","Digital Climate Control","Electric Rear Sunshade","Rear Entertainment Monitor","Smart Entry","Memory Seat"]','Toyota Premio with the desirable EX Package — offering luxury sedan comfort at an accessible price. The 1.8L engine provides smooth, responsive performance ideal for highway and city driving.','Available','X EX Package'),
('Mitsubishi','Outlander PHEV G 4WD',2022,'SUV','Plug-in Hybrid',2400,NULL,22000,'Ironcut Silver','Automatic',19800000,'/placeholder.png','["Plug-in Hybrid (PHEV)","S-AWC Super All-Wheel Control","Electric-only Range 55km","Rockford Fosgate Audio","MI-PILOT Assist","Heated & Ventilated Seats","Tow Bar"]','The Mitsubishi Outlander PHEV offers the best of both worlds — electric efficiency for daily commuting with full 4WD capability when needed. Plug in at home and drive on electricity for most of your journey.','Available','G 4WD'),
('Honda','Fit e:HEV Crosstar',2022,'Hatchback','Hybrid',1500,NULL,18700,'Passion Red Pearl','CVT',8900000,'/placeholder.png','["Crosstar Adventure Package","Honda SENSING","Magic Seats","Honda Connect Display","Rear View Camera","Roof Rails","Stylish Two-tone Paint"]','The Honda Fit e:HEV Crosstar combines the practicality of the Fit''s revolutionary Magic Seat system with a rugged crossover look. Two hybrid motors deliver 17.4 km/L fuel economy.','Available','Crosstar'),
('Toyota','Hiace Super GL',2021,'Van','Diesel',2800,NULL,58000,'White','Automatic',16500000,'/placeholder.png','["Wide Body Super GL","Power Sliding Doors","Toyota Safety Sense","Dark Prime II Package","LED Interior Lighting","Acoustic Glass","Traction Control"]','Toyota Hiace Super GL Dark Prime — the premium business van offering versatile space for passenger or cargo use. Perfect for hotel transfers, airport runs, or family use in Sri Lanka.','Available','Super GL'),
('Toyota','Raize Z Turbo',2023,'SUV','Petrol',1000,NULL,5500,'Barcelona Red Mica','CVT',8400000,'/placeholder.png','["1.0L Turbocharged Engine","Toyota Safety Sense","Digital Cluster","Wireless Charging","9-inch Infotainment","18-inch Alloys","Panoramic View Monitor"]','The Toyota Raize Z Turbo punches well above its size. The 1.0L turbocharged engine delivers spirited performance while keeping fuel consumption low. Sporty compact SUV with full safety tech.','Reserved','Z Turbo'),
('Nissan','Leaf e+ G',2022,'Hatchback','Electric',NULL,160,28000,'Gun Metallic','Automatic',11200000,'/placeholder.png','["62 kWh Battery — 385km Range","ProPILOT Assist","e-Pedal One-Pedal Driving","CHAdeMO DC Fast Charging","Bose Premium Audio","NissanConnect EV","V2H (Vehicle to Home) Ready"]','The Nissan Leaf e+ with 62 kWh battery delivers over 385km real-world range — more than enough for daily Sri Lankan driving. Zero emissions, zero fuel costs, and one of the most advanced safety systems available.','Available','e+ G'),
('Suzuki','Jimny Sierra JC',2022,'SUV','Petrol',1500,NULL,19200,'Kinetic Yellow','Automatic',10500000,'/placeholder.png','["4WD AllGrip Pro System","Low Range Transfer","Ladder Frame Chassis","Apple CarPlay","Rear Differential Lock","Upgraded 15-inch Alloys","LED Headlamps"]','The legendary Suzuki Jimny reborn — now with the larger 1.5L engine for better highway performance. Legendary off-road capability in a compact package. Perfect for both city streets and Sri Lankan mountain roads.','Available','Sierra JC'),
('Toyota','Corolla Axio Hybrid G',2021,'Sedan','Hybrid',1500,NULL,35000,'Silver Metallic','CVT',7600000,'/placeholder.png','["Toyota Hybrid System","Toyota Safety Sense","G Grade Full Leather","Navigation","Smart Entry","LED Headlights","Dual Climate Control"]','The Toyota Corolla Axio Hybrid — reliable Japanese engineering at its best. The 1.5L hybrid system achieves over 28 km/L. A practical, spacious sedan perfect for families in Bandarawela and beyond.','Available','G Hybrid');

-- Reset sequence to continue from current max
SELECT setval(pg_get_serial_sequence('"vehicles"', 'id'), (SELECT MAX(id) FROM "vehicles"));
