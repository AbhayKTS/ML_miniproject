// Tests for creative memory service
const { getMemory, setMemory, clearMemory } = require('../services/creativeMemory');

describe('creativeMemory', () => {
  const UID = 'test-user-001';

  it('should return empty object for new user', async () => {
    const mem = await getMemory(UID);
    expect(typeof mem).toBe('object');
  });

  it('should persist and retrieve memory entries', async () => {
    await setMemory(UID, { theme: 'cyberpunk' });
    const mem = await getMemory(UID);
    expect(mem.theme).toBe('cyberpunk');
  });

  it('should clear memory on request', async () => {
    await clearMemory(UID);
    const mem = await getMemory(UID);
    expect(Object.keys(mem).length).toBe(0);
  });
});
