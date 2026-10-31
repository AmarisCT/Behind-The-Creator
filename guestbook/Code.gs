/**
 * Behind The Creator · the pressed-flower guest book
 * A free backend: this Google Sheet keeps the flowers, and this script serves them.
 *
 * 1. Change GARDENER_KEY below to a password only you know.
 * 2. Deploy → New deployment → Web app · Execute as: Me · Who has access: Anyone.
 * 3. Copy the web app URL into GUESTBOOK_URL in index.html.
 *
 * Every new flower arrives as "pending" and you get an email. Nothing appears on the
 * site until you approve it (from the hidden gardener's panel, or by typing
 * "approved" in the status column here).
 */
const GARDENER_KEY = 'change-this-to-your-secret';
const EMAIL_ME = true;          // an email each time someone signs
const SHEET = 'Guestbook';
const FLOWERS = ['rose', 'daisy', 'lavender', 'forgetmenot', 'marigold', 'fern'];

function sheet_() {
  const ss = SpreadsheetApp.getActive();
  let s = ss.getSheetByName(SHEET);
  if (!s) { s = ss.insertSheet(SHEET); s.appendRow(['id', 'time', 'name', 'flower', 'note', 'status']); s.setFrozenRows(1); }
  return s;
}
const out_ = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const clean_ = (v, n) => { let t = String(v || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n); return /^[=+\-@]/.test(t) ? "'" + t : t; };
const rows_ = () => { const v = sheet_().getDataRange().getValues(); v.shift();
  return v.filter(r => r[0]).map(r => ({ id: String(r[0]), time: r[1] instanceof Date ? r[1].toISOString() : String(r[1]), name: String(r[2]).replace(/^'/, ''), flower: String(r[3]), note: String(r[4]).replace(/^'/, ''), status: String(r[5]).trim().toLowerCase() })); };

function doGet() {
  const entries = rows_().filter(r => r.status === 'approved').reverse().slice(0, 120).map(({ id, time, name, flower, note }) => ({ id, time, name, flower, note }));
  return out_({ ok: true, entries });
}

function doPost(e) {
  let b = {}; try { b = JSON.parse(e.postData.contents); } catch (x) { return out_({ ok: false, error: 'bad' }); }

  if (b.action === 'sign') {
    if (b.website) return out_({ ok: true, status: 'pending' });                 // a bot filled the hidden field
    const name = clean_(b.name, 40), note = clean_(b.note, 280), flower = FLOWERS.includes(b.flower) ? b.flower : 'rose';
    if (!name || !note) return out_({ ok: false, error: 'empty' });
    const cache = CacheService.getScriptCache(), n = +(cache.get('signs') || 0);
    if (n > 30) return out_({ ok: false, error: 'busy' });                          // a gentle limit against floods
    cache.put('signs', String(n + 1), 600);
    const lock = LockService.getScriptLock(); lock.waitLock(8000);
    const id = Utilities.getUuid();
    sheet_().appendRow([id, new Date(), name, flower, note, 'pending']); lock.releaseLock();
    if (EMAIL_ME) try { MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'A new flower for your guest book',
      name + ' pressed a ' + flower + ':\n\n“' + note + '”\n\nApprove or remove it from the gardener’s panel on your site.'); } catch (x) {}
    return out_({ ok: true, status: 'pending', id });
  }

  if (String(b.key || '') !== GARDENER_KEY) { Utilities.sleep(1200); return out_({ ok: false, error: 'key' }); }
  if (b.action === 'list') return out_({ ok: true, entries: rows_().reverse() });
  if (b.action === 'approve' || b.action === 'delete' || b.action === 'hide') {
    const s = sheet_(), v = s.getDataRange().getValues();
    for (let i = 1; i < v.length; i++) if (String(v[i][0]) === String(b.id)) {
      if (b.action === 'delete') s.deleteRow(i + 1); else s.getRange(i + 1, 6).setValue(b.action === 'approve' ? 'approved' : 'pending');
      return out_({ ok: true });
    }
    return out_({ ok: false, error: 'missing' });
  }
  return out_({ ok: false, error: 'unknown' });
}
