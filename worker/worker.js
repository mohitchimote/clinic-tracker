const PASSWORD = 'monica2024';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function rowToRecord(row) {
  return {
    key:          row.key,
    clinic:       row.clinic || 'harley',
    date:         row.date,
    dateObj:      row.date_obj,
    hours:        row.hours,
    t6:           row.t6,
    t3:           row.t3,
    cons:         row.cons,
    bonus:        row.bonus === 1,
    indem:        row.indem === 1,
    gdc:          row.gdc === 1,
    start:        row.start_time,
    end:          row.end_time,
    privateFees:  row.private_fees,
    planCheckups: row.plan_checkups,
    planHygiene:  row.plan_hygiene,
    labCost:      row.lab_cost,
    ddAmount:     row.dd_amount,
    total:        row.total,
  };
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    try {
      if (request.method === 'GET') {
        const url = new URL(request.url);
        if (url.searchParams.get('pwd') !== PASSWORD) return json({ error: 'Unauthorised' }, 401);

        const action = url.searchParams.get('action') || 'getAll';
        if (action === 'getAll') {
          const { results } = await env.DB.prepare('SELECT * FROM clinic_days ORDER BY key').all();
          const data = {};
          results.forEach(row => { data[row.key] = rowToRecord(row); });
          return json({ data });
        }
        return json({ error: 'Unknown action' }, 400);
      }

      if (request.method === 'POST') {
        const body = await request.json();
        if (body.pwd !== PASSWORD) return json({ error: 'Unauthorised' }, 401);

        const { action } = body;

        if (action === 'save') {
          const r = body.record;
          await env.DB.prepare(`
            INSERT INTO clinic_days
              (key, clinic, date, date_obj, hours, t6, t3, cons, bonus, indem, gdc, start_time, end_time,
               private_fees, plan_checkups, plan_hygiene, lab_cost, dd_amount, total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET
              clinic=excluded.clinic, date=excluded.date, date_obj=excluded.date_obj,
              hours=excluded.hours, t6=excluded.t6, t3=excluded.t3, cons=excluded.cons,
              bonus=excluded.bonus, indem=excluded.indem, gdc=excluded.gdc,
              start_time=excluded.start_time, end_time=excluded.end_time,
              private_fees=excluded.private_fees, plan_checkups=excluded.plan_checkups,
              plan_hygiene=excluded.plan_hygiene, lab_cost=excluded.lab_cost, dd_amount=excluded.dd_amount,
              total=excluded.total
          `).bind(
            r.key, r.clinic || 'harley', r.date, r.dateObj,
            r.hours || 0, r.t6 || 0, r.t3 || 0, r.cons || 0,
            r.bonus ? 1 : 0, r.indem ? 1 : 0, r.gdc ? 1 : 0,
            r.start || '', r.end || '',
            r.privateFees || 0, r.planCheckups || 0, r.planHygiene || 0, r.labCost || 0, r.ddAmount || 0,
            r.total
          ).run();
          return json({ success: true });
        }

        if (action === 'delete') {
          await env.DB.prepare('DELETE FROM clinic_days WHERE key = ?').bind(body.key).run();
          return json({ success: true });
        }

        if (action === 'clearAll') {
          await env.DB.prepare('DELETE FROM clinic_days').run();
          return json({ success: true });
        }

        return json({ error: 'Unknown action' }, 400);
      }

      return json({ error: 'Method not allowed' }, 405);
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  },
};
