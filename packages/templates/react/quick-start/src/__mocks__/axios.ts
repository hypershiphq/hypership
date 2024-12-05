// __mocks__/axios.ts
const axiosMock: any = {
  create: jest.fn(() => axiosMock),
  get: jest.fn(),
  post: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
  },
  // Add other methods like put, delete if needed
};

export default axiosMock;
