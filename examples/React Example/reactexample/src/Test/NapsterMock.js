class NapsterMock {
  constructor() {
    this.state = {};
    this.player = {
      on: jest.fn().mockImplementation((a, b) => b({ data: { currentTime: 5, totalTime: 5 } })),
      play: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      seek: jest.fn().mockImplementation(a => 0 + a),
    };
  }
}

export default NapsterMock;
