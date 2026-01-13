import { convexTest } from 'convex-test';
import { describe, expect, test, vi } from 'vitest';
import { api } from '../_generated/api';
import schema from '../schema';

// Import all Convex modules (queries, mutations, actions, etc.)
// Adjust the glob pattern if your file structure differs significantly
const modules = import.meta.glob('../**/*.ts');

describe('Invoices Integration Tests', () => {
  test('createInvoice should create a new invoice record', async () => {
    // 1. Initialize the test environment
    const t = convexTest(schema, modules);

    // 2. Setup initial data (Organizations, Campaigns) if necessary
    const orgId = await t.run(async (ctx) => {
      return await ctx.db.insert('organizations', {
        name: 'Test Org',
        logo: 'http://logo.com',
      });
    });

    const campaignId = await t.run(async (ctx) => {
      return await ctx.db.insert('campaigns', {
        title: 'Test Campaign',
        organizationId: orgId,
        mediaTypes: ['digital', 'tv'],
        status: [{ id: 1, label: 'Draft', state: 'current', deadline: '' }],
        totalBudget: 10000,
        budgetMedia: [],
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        archived: false,
      });
    });

    // Create a mock user to authenticate as
    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert('users', {
        name: 'Test User',
        email: 'test@example.com',
      });
    });

    // 3. Run the mutation under test
    const invoiceData = {
      title: 'FAC-2024-001',
      invoiceType: 'agency' as const,
      htprice: 1000,
      ttcprice: 1200,
      startDate: '2024-01-01',
      dueDate: '2024-02-01',
      url: 'http://invoice.pdf',
      publicId: 'public_id_123',
      resourceType: 'raw' as const,
      campaignId: campaignId,
      organizationId: orgId,
    };

    const invoiceId = await t
      .withIdentity({ subject: userId })
      .mutation(api.mutations.invoices.createInvoice, invoiceData);

    // 4. Assertions
    expect(invoiceId).toBeDefined();

    // Verify it was inserted
    const invoice = await t.run(async (ctx) => {
      return await ctx.db.get(invoiceId);
    });

    expect(invoice).toBeDefined();
    expect(invoice?.title).toBe('FAC-2024-001');
    expect(invoice?.ttcprice).toBe(1200);
    expect(invoice?.campaignId).toBe(campaignId);
  });
});
