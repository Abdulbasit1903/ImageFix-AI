import request from 'supertest';
import { createApp } from './server';

describe('ImageFix AI API', () => {
  it('returns the health status payload', async () => {
    const app = createApp();

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('rejects empty diagnosis requests', async () => {
    const app = createApp();

    const response = await request(app).post('/api/diagnose').send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/image|description/i);
  });

  it('returns a structured diagnosis payload when the user submits a device description', async () => {
    const app = createApp();

    const response = await request(app).post('/api/diagnose').send({
      problemDescription: 'GPU artifacting and black screen during 3D render tests',
      category: 'Computer Component',
      deviceModel: 'NVIDIA GeForce RTX 3080',
    });

    expect(response.status).toBe(200);
    expect(response.body.detectedDevice).toMatch(/RTX 3080|GeForce/i);
    expect(response.body).toHaveProperty('possibleCauses');
    expect(response.body.possibleCauses.length).toBeGreaterThan(0);
    expect(response.body.troubleshootingSteps.length).toBeGreaterThan(0);
  });

  it('provides a safe fallback troubleshooting reply when the user describes a power issue', async () => {
    const app = createApp();

    const response = await request(app).post('/api/troubleshoot-chat').send({
      caseData: {
        detectedDevice: 'NVIDIA GeForce RTX 3080',
        category: 'Computer Component',
        problemDescription: 'Black screen after heavy load',
      },
      messages: [],
      userQuery: 'The cable is loose and power flickers',
    });

    expect(response.status).toBe(200);
    expect(response.body.reply).toMatch(/power cable|outlet|power socket/i);
  });
});
