export type SensorId =
  | 'ultrasonic'
  | 'dht22'
  | 'pir'
  | 'mq2'
  | 'ldr'
  | 'soil_moisture'
  | 'ir_obstacle'
  | 'rfid'
  | 'bmp280'
  | 'mpu6050'
  | 'hx711'
  | 'water_flow'
  | 'flame'
  | 'sound';

export interface SensorSpec {
  id: SensorId;
  name: string;
  model: string;
  signal: string;
  shortRole: string;
  accentColor: string;
}

export interface ScenarioQuestion {
  id: string;
  context: string;
  situation: string;
  correctSensorId: SensorId;
  distractorIds: [SensorId, SensorId, SensorId];
  fact: string;
}

export interface GameRound {
  roundNumber: number;
  scenario: ScenarioQuestion;
  options: SensorSpec[];
}

export const SENSORS: Record<SensorId, SensorSpec> = {
  ultrasonic: {
    id: 'ultrasonic',
    name: 'Ultrasonic Distance',
    model: 'HC-SR04',
    signal: 'Digital Trigger / Echo',
    shortRole: 'Measures distance using 40 kHz sound waves',
    accentColor: '#0284C7',
  },
  dht22: {
    id: 'dht22',
    name: 'Temp & Humidity',
    model: 'DHT22 / AM2302',
    signal: 'Single-Wire Digital',
    shortRole: 'Tracks ambient air temperature and humidity',
    accentColor: '#2563EB',
  },
  pir: {
    id: 'pir',
    name: 'PIR Motion',
    model: 'HC-SR501',
    signal: 'Digital High / Low',
    shortRole: 'Detects warm body movement via infrared shift',
    accentColor: '#7C3AED',
  },
  mq2: {
    id: 'mq2',
    name: 'Smoke & Gas',
    model: 'MQ-2',
    signal: 'Analog / Threshold Digital',
    shortRole: 'Senses LPG, methane, propane, and smoke',
    accentColor: '#EA580C',
  },
  ldr: {
    id: 'ldr',
    name: 'Light Photoresistor',
    model: 'GL5528 LDR',
    signal: 'Analog Voltage Divider',
    shortRole: 'Changes resistance based on brightness level',
    accentColor: '#D97706',
  },
  soil_moisture: {
    id: 'soil_moisture',
    name: 'Soil Moisture',
    model: 'Capacitive v1.2',
    signal: 'Analog Voltage',
    shortRole: 'Reads water content in potting mix or soil',
    accentColor: '#059669',
  },
  ir_obstacle: {
    id: 'ir_obstacle',
    name: 'IR Proximity / Line',
    model: 'TCRT5000 / FC-51',
    signal: 'Digital / Analog',
    shortRole: 'Detects close objects or dark/white lines',
    accentColor: '#4F46E5',
  },
  rfid: {
    id: 'rfid',
    name: 'RFID Card Reader',
    model: 'MFRC522 (13.56 MHz)',
    signal: 'SPI Bus',
    shortRole: 'Reads unique IDs from contactless tags and cards',
    accentColor: '#0D9488',
  },
  bmp280: {
    id: 'bmp280',
    name: 'Barometric Pressure',
    model: 'BMP280',
    signal: 'I2C / SPI',
    shortRole: 'Measures air pressure and estimates altitude',
    accentColor: '#0369A1',
  },
  mpu6050: {
    id: 'mpu6050',
    name: '6-Axis IMU Gyro',
    model: 'MPU-6050',
    signal: 'I2C Bus',
    shortRole: 'Tracks tilt, acceleration, and rotation speed',
    accentColor: '#9333EA',
  },
  hx711: {
    id: 'hx711',
    name: 'Load Cell Weight',
    model: 'HX711 + Strain Gauge',
    signal: '2-Wire Serial ADC',
    shortRole: 'Measures physical mass and downward force',
    accentColor: '#475569',
  },
  water_flow: {
    id: 'water_flow',
    name: 'Water Flow Hall',
    model: 'YF-S201',
    signal: 'Digital Pulse',
    shortRole: 'Counts turbine spins to measure litres per minute',
    accentColor: '#0891B2',
  },
  flame: {
    id: 'flame',
    name: 'IR Flame Sensor',
    model: 'YG1006',
    signal: 'Digital / Analog',
    shortRole: 'Detects open fire wavelengths (760–1100 nm)',
    accentColor: '#E11D48',
  },
  sound: {
    id: 'sound',
    name: 'Sound Microphone',
    model: 'KY-037 / MAX4466',
    signal: 'Analog / Digital',
    shortRole: 'Captures claps, noise spikes, and decibel levels',
    accentColor: '#DB2777',
  },
};

export const SCENARIOS: ScenarioQuestion[] = [
  {
    id: 'carpark-clearance',
    context: 'Smart Carpark',
    situation:
      'An overhead ceiling unit checks whether a parking bay is empty or occupied by measuring the gap down to the car roof.',
    correctSensorId: 'ultrasonic',
    distractorIds: ['pir', 'ldr', 'bmp280'],
    fact: 'HC-SR04 sends a 40 kHz sound pulse and times the echo return. Since sound travels at ~343 m/s, dividing echo time by 2 gives exact distance from 2 cm to 400 cm.',
  },
  {
    id: 'corridor-lights',
    context: 'HDB Smart Lighting',
    situation:
      'Corridor LEDs stay off during bright sunny afternoons and switch on automatically as soon as evening dusk settles in.',
    correctSensorId: 'ldr',
    distractorIds: ['pir', 'dht22', 'ir_obstacle'],
    fact: 'An LDR (Light Dependent Resistor) drops its resistance from megaohms in the dark down to a few hundred ohms in sunlight, making it easy to read via an ESP32 analog pin.',
  },
  {
    id: 'corridor-occupancy',
    context: 'Campus Restroom',
    situation:
      'An energy-saving ceiling node switches on exhaust fans only when a person walks into the room, ignoring cold furniture.',
    correctSensorId: 'pir',
    distractorIds: ['ultrasonic', 'sound', 'rfid'],
    fact: 'A PIR (Passive Infrared) sensor uses a white Fresnel lens and dual pyroelectric elements to spot moving sources of body heat without emitting any waves itself.',
  },
  {
    id: 'server-rack',
    context: 'ITE Server Rack',
    situation:
      'A lab alert triggers on Telegram whenever the enclosed server cabinet gets hotter than 35 °C or exceeds 75% relative moisture.',
    correctSensorId: 'dht22',
    distractorIds: ['bmp280', 'soil_moisture', 'mq2'],
    fact: 'DHT22 houses a capacitive humidity element and an NTC thermistor inside its white vented grille, delivering calibrated digital readings accurate to ±0.5 °C.',
  },
  {
    id: 'rooftop-farm',
    context: 'Urban Vertical Farm',
    situation:
      'An automated drip pump waters basil planter boxes only when the potting mix dries below 30% hydration.',
    correctSensorId: 'soil_moisture',
    distractorIds: ['dht22', 'water_flow', 'ldr'],
    fact: 'Capacitive soil sensors (v1.2) measure dielectric permittivity instead of passing DC current between exposed metal prongs, so they resist rust and last much longer.',
  },
  {
    id: 'kitchen-leak',
    context: 'Hawker Stall Safety',
    situation:
      'A safety controller cuts off the solenoid valve and sounds a buzzer if cooking gas leaks near the stove hose.',
    correctSensorId: 'mq2',
    distractorIds: ['flame', 'dht22', 'bmp280'],
    fact: 'MQ-2 uses a heated tin-dioxide (SnO₂) semiconductor inside its stainless mesh cap whose conductivity rises sharply in the presence of LPG, propane, methane, or smoke.',
  },
  {
    id: 'maker-attendance',
    context: 'Robotics Lab Access',
    situation:
      'Students tap their student pass against a door terminal to unlock the 3D printer cabinet and log lab attendance.',
    correctSensorId: 'rfid',
    distractorIds: ['ir_obstacle', 'pir', 'ultrasonic'],
    fact: 'The MFRC522 generates a 13.56 MHz electromagnetic field that powers passive NFC/RFID tags from a few centimetres away and reads their unique UID over SPI.',
  },
  {
    id: 'agv-line-follower',
    context: 'Warehouse Robot',
    situation:
      'A mini AGV buggy follows a black electrical-tape track across a white workshop floor without drifting off course.',
    correctSensorId: 'ir_obstacle',
    distractorIds: ['ultrasonic', 'ldr', 'mpu6050'],
    fact: 'An IR reflectance module emits infrared light and checks how much bounces back—white floors reflect strongly while matte black tape absorbs it.',
  },
  {
    id: 'elderly-fall',
    context: 'Wearable Health Badge',
    situation:
      'A clip-on safety badge detects a sudden tilt angle change followed by a sharp impact spike if an elderly wearer slips.',
    correctSensorId: 'mpu6050',
    distractorIds: ['pir', 'hx711', 'bmp280'],
    fact: 'The MPU-6050 combines a 3-axis accelerometer and a 3-axis gyroscope on a tiny MEMS silicon chip, measuring both gravity orientation and angular velocity via I2C.',
  },
  {
    id: 'parcel-conveyor',
    context: 'Logistics Sorter',
    situation:
      'A sorting station checks whether each cardboard parcel on the platform exceeds 2.0 kg before routing it to heavy freight.',
    correctSensorId: 'hx711',
    distractorIds: ['ultrasonic', 'ir_obstacle', 'mpu6050'],
    fact: 'A strain-gauge load cell bends microscopically under weight, changing bridge resistance by millivolts; the HX711 24-bit ADC amplifies that tiny signal for your MCU.',
  },
  {
    id: 'hydroponics-pipe',
    context: 'Aquaponics System',
    situation:
      'A dashboard calculates exact daily water consumption in litres by tracking how fast nutrient solution moves through a PVC pipe.',
    correctSensorId: 'water_flow',
    distractorIds: ['soil_moisture', 'bmp280', 'ultrasonic'],
    fact: 'Inside the YF-S201 housing, flowing water spins a tiny magnetic rotor past a Hall-effect sensor, outputting digital pulses proportional to flow rate.',
  },
  {
    id: 'weather-drone',
    context: 'Micro Weather Balloon',
    situation:
      'A compact flight logger estimates how many metres above sea level a drone has climbed and spots oncoming storm pressure drops.',
    correctSensorId: 'bmp280',
    distractorIds: ['dht22', 'mpu6050', 'ultrasonic'],
    fact: 'Air pressure drops predictably as altitude rises (~12 Pa per metre near sea level), allowing the Bosch BMP280 to act as both a barometer and an altimeter.',
  },
  {
    id: 'welding-bay',
    context: 'Metal Workshop',
    situation:
      'A ceiling monitor watches a storage corner for open fire sparks and triggers an emergency strobe within milliseconds.',
    correctSensorId: 'flame',
    distractorIds: ['mq2', 'dht22', 'ldr'],
    fact: 'Flame sensors use an IR receiver tuned specifically to the 760–1100 nm wavelength emitted by burning flames, reacting much faster than smoke or temperature rise.',
  },
  {
    id: 'library-quiet',
    context: 'Study Pod Monitor',
    situation:
      'An IoT display inside a campus study zone flashes a friendly reminder whenever group chatter stays louder than 70 dB.',
    correctSensorId: 'sound',
    distractorIds: ['pir', 'ultrasonic', 'mq2'],
    fact: 'An electret microphone module converts acoustic air pressure vibrations into an analog waveform; sampling peak-to-peak amplitude over 50 ms reveals loudness.',
  },
  {
    id: 'water-tank-level',
    context: 'Rainwater Harvesting',
    situation:
      'Mounted under the lid of a 500-litre tank, a non-contact sensor tracks how full the water level is without getting wet.',
    correctSensorId: 'ultrasonic',
    distractorIds: ['water_flow', 'soil_moisture', 'hx711'],
    fact: 'Measuring downward from the tank lid to the water surface avoids corrosion and fouling, unlike submerged float switches.',
  },
  {
    id: 'automatic-bin',
    context: 'Touchless Rubbish Bin',
    situation:
      'Waving a hand within 10 cm directly in front of a smart bin lid triggers a servo motor to swing the cover open.',
    correctSensorId: 'ir_obstacle',
    distractorIds: ['rfid', 'sound', 'soil_moisture'],
    fact: 'Short-range IR proximity modules use a potentiometer to tune detection distance between 2 cm and 30 cm, ideal for touchless triggers.',
  },
  {
    id: 'greenhouse-shade',
    context: 'Botanical Lab',
    situation:
      'Motorised blinds unroll halfway across glass panes whenever midday sunlight intensity exceeds 40,000 lux to stop leaf scorch.',
    correctSensorId: 'ldr',
    distractorIds: ['flame', 'dht22', 'soil_moisture'],
    fact: 'Pairing an LDR with a 10 kΩ pull-down resistor forms a simple voltage divider whose analog reading rises smoothly with ambient brightness.',
  },
  {
    id: 'bike-lock-tamper',
    context: 'Smart Bicycle Lock',
    situation:
      'A parked e-scooter raises a silent phone alert if someone lifts or shakes the frame while the lock is armed.',
    correctSensorId: 'mpu6050',
    distractorIds: ['rfid', 'pir', 'ir_obstacle'],
    fact: 'Monitoring sudden changes across the X, Y, and Z accelerometer axes lets battery-powered IoT trackers wake up from sleep only when moved.',
  },
];

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const TOTAL_ROUNDS = 10;

export function buildGameDeck(): GameRound[] {
  const shuffled = shuffleArray(SCENARIOS);
  const selected: ScenarioQuestion[] = [];
  const usedIds = new Set<string>();

  // First pass: prefer scenarios with distinct correct sensors so rounds stay fresh
  const seenSensors = new Set<SensorId>();
  for (const scenario of shuffled) {
    if (selected.length >= TOTAL_ROUNDS) break;
    if (!seenSensors.has(scenario.correctSensorId)) {
      selected.push(scenario);
      usedIds.add(scenario.id);
      seenSensors.add(scenario.correctSensorId);
    }
  }

  // Fill remaining slots if fewer than 10 unique sensors were picked
  for (const scenario of shuffled) {
    if (selected.length >= TOTAL_ROUNDS) break;
    if (!usedIds.has(scenario.id)) {
      selected.push(scenario);
      usedIds.add(scenario.id);
    }
  }

  return shuffleArray(selected).map((scenario, idx) => {
    const optionIds = shuffleArray<SensorId>([
      scenario.correctSensorId,
      ...scenario.distractorIds,
    ]);
    return {
      roundNumber: idx + 1,
      scenario,
      options: optionIds.map((id) => SENSORS[id]),
    };
  });
}
