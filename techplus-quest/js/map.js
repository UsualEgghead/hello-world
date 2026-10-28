// Map data and grid builder for Tech+ Quest.
// UMD-style export so this file can be loaded as a plain <script> in the
// browser (attaches to window.TechPlusMap) and also required from Node
// for automated connectivity tests (see test/map.test.js).
(function (global) {
  var TILE_SIZE = 32;
  var COLS = 50;
  var ROWS = 34;

  // Tile values
  var FLOOR = 0;
  var WALL = 1;
  var TERMINAL = 2;

  // One room per CompTIA Tech+ domain, arranged 3 across x 2 down around a
  // central hub + corridor system.
  var ROOMS = [
    { id: 'concepts', name: 'IT Concepts & Terminology', color: '#4f8fdb', x: 2, y: 2, w: 12, h: 9 },
    { id: 'infrastructure', name: 'Infrastructure', color: '#e0923b', x: 19, y: 2, w: 12, h: 9 },
    { id: 'applications', name: 'Applications & Software', color: '#5bc08a', x: 36, y: 2, w: 12, h: 9 },
    { id: 'development', name: 'Software Development', color: '#b06fd9', x: 2, y: 23, w: 12, h: 9 },
    { id: 'database', name: 'Database Fundamentals', color: '#e0597a', x: 19, y: 23, w: 12, h: 9 },
    { id: 'security', name: 'Security', color: '#2ec4c4', x: 36, y: 23, w: 12, h: 9 }
  ];

  // Central hub room (spawn point) sits between the two rows of rooms.
  var HUB = { x: 19, y: 13, w: 12, h: 8 };

  function fillRect(grid, zoneGrid, x0, y0, w, h, value, zoneId) {
    for (var y = y0; y < y0 + h; y++) {
      for (var x = x0; x < x0 + w; x++) {
        if (y < 0 || y >= ROWS || x < 0 || x >= COLS) continue;
        grid[y][x] = value;
        if (zoneId !== undefined) zoneGrid[y][x] = zoneId;
      }
    }
  }

  function buildGrid() {
    var grid = [];
    var zoneGrid = [];
    for (var y = 0; y < ROWS; y++) {
      grid.push(new Array(COLS).fill(WALL));
      zoneGrid.push(new Array(COLS).fill(null));
    }

    // Carve the hub.
    fillRect(grid, zoneGrid, HUB.x, HUB.y, HUB.w, HUB.h, FLOOR, 'hub');

    // Carve each room and its terminal, plus a corridor connecting it to the hub.
    var terminals = {};
    ROOMS.forEach(function (room) {
      fillRect(grid, zoneGrid, room.x, room.y, room.w, room.h, FLOOR, room.id);

      var termX = room.x + Math.floor(room.w / 2);
      var termY = room.y + Math.floor(room.h / 2);
      grid[termY][termX] = TERMINAL;
      terminals[room.id] = { x: termX, y: termY };

      // Vertical corridor from room to the hub's row band, then the hub
      // handles the horizontal connection since hub spans the full middle.
      var corridorX = room.x + Math.floor(room.w / 2);
      var isTopRow = room.y < HUB.y;
      var corridorYStart = isTopRow ? room.y + room.h : HUB.y + HUB.h;
      var corridorYEnd = isTopRow ? HUB.y : room.y;
      var yFrom = Math.min(corridorYStart, corridorYEnd);
      var yTo = Math.max(corridorYStart, corridorYEnd);
      fillRect(grid, zoneGrid, corridorX - 1, yFrom, 3, yTo - yFrom, FLOOR, 'corridor');

      // Horizontal nudge so the corridor lines up with the hub width.
      fillRect(grid, zoneGrid, Math.min(corridorX - 1, HUB.x), isTopRow ? HUB.y - 1 : HUB.y + HUB.h, Math.abs(corridorX - HUB.x) + 3, 1, FLOOR, 'corridor');
    });

    return {
      grid: grid,
      zoneGrid: zoneGrid,
      cols: COLS,
      rows: ROWS,
      tileSize: TILE_SIZE,
      terminals: terminals,
      spawn: { x: HUB.x + Math.floor(HUB.w / 2), y: HUB.y + Math.floor(HUB.h / 2) }
    };
  }

  var api = {
    TILE_SIZE: TILE_SIZE,
    COLS: COLS,
    ROWS: ROWS,
    FLOOR: FLOOR,
    WALL: WALL,
    TERMINAL: TERMINAL,
    ROOMS: ROOMS,
    HUB: HUB,
    buildGrid: buildGrid
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.TechPlusMap = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
