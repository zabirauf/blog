export const DEFAULT_BUTTONS = [
  {
    name: 'Vol Up',
    events: ['SendNMEAPort1 BVU'],
  },
  {
    name: 'Vol Down',
    events: ['SendNMEAPort1 BVD'],
  },
  {
    name: 'Sink 1ms',
    events: ['SendNMEAPort1 BFS 100', 'SendNMEAPort1 BOS 100'],
  },
  {
    name: 'Sink 2ms',
    events: ['SendNMEAPort1 BFS 200', 'SendNMEAPort1 BOS 200'],
  },
  {
    name: 'Sink 3ms',
    events: ['SendNMEAPort1 BFS 300', 'SendNMEAPort1 BOS 300'],
  },
  {
    name: 'Test Beep',
    events: [
      'SendNMEAPort1 BSD 1000 500 800 500 600 500 400 2000 1000 500 800 500 600 500 400 2000',
    ],
  },
  {
    name: 'LXMode',
    events: ['SendNMEAPort1 BOM 2', 'SendNMEAPort1 BOF 10'],
  },
  {
    name: 'BFMode',
    events: ['SendNMEAPort1 BTN', 'SendNMEAPort1 BOM 0', 'SendNMEAPort1 BOF 1'],
  },
  {
    name: 'Togg Off',
    events: ['SendNMEAPort1 BTT 2000'],
  },
];

export const CANCEL_BUTTON = {
  name: 'Cancel',
  events: ['Mode default'],
};

export const DEFAULT_MENU_BUTTONS = [
  DEFAULT_BUTTONS[0],
  DEFAULT_BUTTONS[1],
  DEFAULT_BUTTONS[2],
  DEFAULT_BUTTONS[3],
  CANCEL_BUTTON,
];
