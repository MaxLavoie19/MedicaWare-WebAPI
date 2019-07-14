import 'jasmine';
import { PostgresToJsonService } from './postgres-to-json.service';
import { Client } from 'ts-postgres';

describe('Service: PostgresToJson', () => {
  beforeEach(() => {});

  it('should ...', () => {
    const mockClient = jasmine.createSpyObj('Client', []);
    const postgresToJsonService = new PostgresToJsonService(mockClient);
    expect(postgresToJsonService).toBeTruthy();
  });
});
