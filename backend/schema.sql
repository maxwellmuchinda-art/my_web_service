-- Music Festival Line-Up (Question 7)
-- Running this file again resets the table to the 10 sample records.

DROP TABLE IF EXISTS lineup;

CREATE TABLE lineup (
  id INT AUTO_INCREMENT PRIMARY KEY,
  festival_name VARCHAR(150) NOT NULL,
  artist_name VARCHAR(150) NOT NULL,
  stage VARCHAR(80),
  genre VARCHAR(60),
  performance_date DATE,
  start_time TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO lineup (festival_name, artist_name, stage, genre, performance_date, start_time) VALUES
('Lusaka Music Fest', 'Kalimba Sound',    'Main Stage',   'Afrobeat',  '2026-12-05', '18:00:00'),
('Lusaka Music Fest', 'Nandi Voices',     'Main Stage',   'Gospel',    '2026-12-05', '19:30:00'),
('Lusaka Music Fest', 'The Copper Band',  'Second Stage', 'Rock',      '2026-12-05', '17:00:00'),
('Lusaka Music Fest', 'DJ Mulenga',       'Dance Tent',   'House',     '2026-12-05', '21:00:00'),
('Lusaka Music Fest', 'Zambezi Roots',    'Main Stage',   'Reggae',    '2026-12-06', '16:00:00'),
('Lusaka Music Fest', 'Mwila & Friends',  'Second Stage', 'Hip Hop',   '2026-12-06', '17:30:00'),
('Lusaka Music Fest', 'Chanda Strings',   'Acoustic Lounge', 'Folk',   '2026-12-06', '15:00:00'),
('Lusaka Music Fest', 'Bwalya Beats',     'Dance Tent',   'Amapiano',  '2026-12-06', '22:00:00'),
('Lusaka Music Fest', 'Tamara Joy',       'Main Stage',   'R&B',       '2026-12-06', '20:00:00'),
('Lusaka Music Fest', 'Kafue Kings',      'Main Stage',   'Kalindula', '2026-12-07', '19:00:00');
