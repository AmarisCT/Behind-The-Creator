# The pressed-flower guest book

The guest book runs on a free Google Sheet with a small Google Apps Script. Visitors don't need an account, and nothing appears on the site until you approve it.

## Setting it up (about five minutes)

1. Create a new Google Sheet. Name it something like **Behind The Creator · Guest Book**.
2. In the sheet, open **Extensions → Apps Script**.
3. Delete what's there and paste in everything from `Code.gs` in this folder.
4. On the first line, change `GARDENER_KEY` to a secret only you know. Click **Save**.
5. Click **Deploy → New deployment**, then click the gear and choose **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy** and allow the permissions. Google will warn that the app isn't verified, because you wrote it yourself: choose **Advanced → Go to (project name)**.
7. Copy the **Web app URL**, which ends in `/exec`, and paste it into `GUESTBOOK_URL` in `index.html`.

The guest book section stays hidden until that URL is filled in.

## Tending the book

- **The secret door:** press and hold the little wax seal beside my signature for three seconds. You can also add `?gardener` to the site's address.
- Enter your secret. You'll see the flowers **waiting** and the ones **in the book**.
- **Approve** puts a flower in the book, **Take out** hides it again and **Delete** removes it for good.
- You get an email each time someone signs. To turn this off, set `EMAIL_ME = false` in the script.
- You can also tend the book straight from the sheet: type `approved` in a row's status column, or delete the row.

If you ever change the script, choose **Deploy → Manage deployments → Edit → New version**. That keeps the same URL.
