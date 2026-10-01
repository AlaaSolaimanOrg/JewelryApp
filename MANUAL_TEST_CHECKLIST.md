# Adi Jewelry POS — Manual Test Checklist

Follow the sections in order. Each step reads **Do → What you should see**.
Later steps use the data you create in earlier steps, so don't skip ahead.

---

## 0. Before you start

### Test users you need

Create them in section 21 (Staff) if they don't exist yet. You need at least:

| User | Roles | Used for |
|---|---|---|
| admin@test | Admin | Most of the test |
| pos@test | PosRole | POS-only check |
| terminal@test | TerminalRole | Terminal-only check |
| staffmgr@test | StaffManager | Staff-manager-only check |
| adminpos@test | Admin + PosRole | Main test user for the POS screens (it can open both POS and Admin) |

### Test data used throughout (write it down)

| Name | Details |
|---|---|
| Gold prices | 18K = **$80/g**, 21K = **$95/g**, 22K = **$100/g**, 24K = **$110/g** |
| Customer A | "Test Customer A", phone 780-555-0101, email a@test.com, birthday in the current month |
| Customer B | "Test Customer B", phone 780-555-0102, no email |
| Product P1 | "Test Ring 21K", Rings, size 7, 21K, **5 g**, quantity **3** → price **5 × 95 = $475.00** |
| Product P2 | "Test Necklace 18K", Necklaces, size 45, 18K, **10 g**, quantity **1** → price **10 × 80 = $800.00** |
| Product L1 | "Test Lira", Bullion, 24K, **8 g**, quantity **5**, tag **lira** → price **8 × 110 = $880.00** |
| Product O1 | "Test Ounce", Bullion, 24K, **31.1 g**, quantity **2**, tag **ounce** → price **31.1 × 110 = $3,421.00** |

### Baseline sheet

Before you create anything, write these numbers down. You will compare them later.

- [ ] Admin Dashboard: Sales revenue today, transactions, Store cash box, Transfers box, Used gold on hand, Stock value (items, grams).
- [ ] POS Cash Management: Store cash box balance, Transfers cash box balance.
- [ ] Inventory: the summary strip (products found, pieces, total weight, stock value).

---

## 1. Login

- [ ] Open `/login` → the "Adi Jewelry POS" card appears with Email, Password, Remember me and Sign in.
- [ ] Click Sign in with both fields empty → the browser blocks it ("Please fill out this field").
- [ ] Type `abc` in Email and submit → the browser shows an invalid email message.
- [ ] Enter a correct email with a wrong password → a red error toast appears and you stay on the login page.
- [ ] Click the eye icon → the password shows as text. Click again → it's hidden.
- [ ] While logging in, the button reads "Signing in..." and is disabled.
- [ ] Log in as **admin@test** → you go to `/admin/dashboard`.
- [ ] Log in as **pos@test** → you go to `/` (the POS home).
- [ ] Log in as **terminal@test** → you go to `/admin/inventory/products`.
- [ ] Log in as **staffmgr@test** → you go to `/admin/staff`.
- [ ] Log in as **adminpos@test** → you go to `/` (POS takes priority when a user has both).
- [ ] Log in as an **inactive** user (set up in section 21) → login is refused with an error.
- [ ] Log in **without** Remember me, close the browser completely, reopen the app → you're back on the login page.
- [ ] Log in **with** Remember me, close the browser, reopen → you're still logged in.
- [ ] Log out and type `/admin/dashboard` in the address bar → you're sent to `/login`.
- [ ] Click the sun/moon button on the login page → the theme switches between light and dark.
- [ ] Open `/unauthorized` → "Unauthorized Access" appears. Click "Go to Login" → the login page opens.

---

## 2. Admin layout (sidebar + header) — check once as admin

- [ ] The sidebar shows Dashboard, Analytics, Inventory, Reports, Pricing, Customers, Used Gold, Staff, Return Management, Settings, then Operations (Add Product, Add Staff) and Logout.
- [ ] Click Inventory → it expands to Products / Melted Products and opens Products. The arrow rotates.
- [ ] Click Reports → it expands to Sales / Inventory / Repairs / Customers Reports and opens Sales Reports.
- [ ] The header title matches every page you open, and today's date is correct.
- [ ] The header avatar shows the first 2 letters of your username.
- [ ] Click Refresh in the header → the page reloads and you stay on the same page.
- [ ] Click the theme toggle → all admin pages switch theme. Refresh the page → the theme you chose is kept.
- [ ] Make the window narrow (phone width) → a ☰ button appears. It opens the sidebar. Clicking outside or opening a page closes it.
- [ ] Log in as **adminpos@test** → the sidebar shows **POS** under "System", and clicking it opens the POS home.
- [ ] Click Logout → you go to `/login`. Pressing Back does not show admin data.

---

## 3. Settings (`/admin/settings`)

- [ ] Open Settings → two cards appear: Security Settings (the POS "View sales" PIN) and Inventory Settings (the low stock threshold). Both show the values currently saved.
- [ ] In the PIN box, type letters → nothing appears (only digits are allowed). You can't type more than 4 digits.
- [ ] Enter `123` and click Save PIN → you see the error "PIN must be exactly 4 digits."
- [ ] Enter `4321` and click Save PIN → the button shows "Saving..." and then a success message appears.
- [ ] Refresh the page → the PIN still shows `4321`.
- [ ] Clear the low stock threshold and click Save → you see "Low stock threshold must be a whole number."
- [ ] Set the threshold to `10` and click Save → a success message appears. Refresh → it still shows `10`.
- [ ] **Later check (section 18):** L1 has 5 in stock, which is under 10 → Inventory Reports' "Bullions sold" table shows **LOW — reorder** for it.
- [ ] **Later check (sections 8 and 9):** the POS PIN pad accepts `4321` and rejects any other PIN.

---

## 4. Pricing (`/admin/pricing`)

- [ ] Open Pricing → four cards appear (18K, 21K, 22K, 24K). Each shows the current $/g and "X g in stock".
- [ ] With nothing changed, the button reads "No changes" and is disabled.
- [ ] Set 18K = 80, 21K = 95, 22K = 100, 24K = 110. The button changes to "Apply 4 changes".
- [ ] Each changed card shows the old price → new price, the % change, and "stock value ±$".
- [ ] **Math check:** the impact on a card = (new price − old price) × grams in stock. Example: old 21K $90, new $95, 15 g in stock → +$5 × 15 = **+$75**.
- [ ] The yellow box underneath shows the total impact and "current value → new value". Current value = sum of (old price × grams) for each karat.
- [ ] Clear one price completely → the Apply button is disabled.
- [ ] Type a minus sign or scroll the mouse wheel on the input → nothing changes.
- [ ] Put the price back to its original value → that card goes back to "Current price" and the change count drops.
- [ ] Click Apply → a success message appears and the button returns to "No changes". Refresh → the new prices are kept.
- [ ] **After section 6:** "g in stock" for 21K = P1 weight × quantity = 5 × 3 = **15 g** (plus any other 21K stock). 24K includes L1 (8 × 5 = 40 g) and O1 (31.1 × 2 = 62.2 g).
- [ ] **After section 10:** POS uses these prices. Adding P1 to the cart shows $/g = **95**.

---

## 5. Customers (`/admin/customers`)

- [ ] Open Customers → the title reads "Customers (N)" and the table has Name, Phone, Email, Birthday, Items, Total purchases, Last purchase, Actions.
- [ ] Click Add customer → the "Add new customer" modal opens.
- [ ] Click Save with everything empty → you see "Name is required." and "Phone number is required."
- [ ] Name = `A` → "Name must be at least 2 characters."
- [ ] Phone = `780555` → "Please enter a 10-digit Canadian phone number."
- [ ] While you type a phone number, it formats itself as `780-555-0101`. You can't type more than 10 digits.
- [ ] Email = `abc@` → "Please enter a valid email address."
- [ ] The Birthday picker won't let you pick a future date.
- [ ] Create **Customer A** with all fields filled → a success message appears, the modal closes, and the customer appears in the table. The phone shows as 780-555-0101 and the birthday has a "🎂 this month" badge.
- [ ] Create **Customer B** with only a name and phone → the email and birthday columns show "—".
- [ ] Try to create another customer with phone 780-555-0101 → you get an error that the customer already exists, and no duplicate is created.
- [ ] Click Cancel or the X in the modal → it closes and nothing is saved. Reopen it → the form is empty.
- [ ] Click ✏️ on Customer B and change the name to "Test Customer B2" → after Update, the new name shows in the table.
- [ ] Edit a customer and clear the phone → you get the "Phone number is required." error.
- [ ] Search `Test Customer` (wait about 1 s) → only matching customers remain. Search by `5550101` or by email → Customer A appears.
- [ ] Search `zzzzzz` → "No results found".
- [ ] Clear the search → the full list comes back.
- [ ] Click each sortable header (Name, Phone, Email, Birthday, Items, Total purchases, Last purchase) → a ▲ arrow appears and the rows are sorted. Click again → ▼ and the order reverses.
- [ ] Set Page size to 10 → only 10 rows show. Next/Prev and page numbers work. Prev is disabled on page 1 and Next is disabled on the last page.
- [ ] Click 🧾 on Customer A → the "Purchase history" modal opens and shows "No purchase history found." (no sales yet).
- [ ] **Tiers:** a customer who has spent ≥ $8,000 shows BRONZE, ≥ $25,000 SILVER, ≥ $50,000 GOLD, ≥ $100,000 VIP.
- [ ] **After section 10:** Customer A's Items, Total purchases and Last purchase are updated. The history lists the sale, and "View receipt" opens it.

---

## 6. Add / Edit Product (`/admin/addProduct`, `/admin/editProduct/:id`)

- [ ] Open Add Product → a form with Product name, SKU (greyed out), Quantity (1), Karat, Weight, Category, Product type (Gold), Tags, Description and Product images.
- [ ] Save product is disabled while the name, karat, weight or category is empty, or when weight or quantity is 0.
- [ ] Pick a Category → the SKU fills in automatically, a barcode appears, and the Copy SKU button works (the icon turns into a ✓).
- [ ] Change the category → a new SKU is generated.
- [ ] Pick Rings, Necklaces, Bracelets or Bangles → a **Size** field appears. Pick Earrings, Pendants or Bullion → no Size field.
- [ ] You can't type a minus sign in Quantity or Weight, and Quantity accepts whole numbers only.
- [ ] Type a tag and press Enter → it becomes a chip. The same tag can't be added twice. The ✕ on a chip removes it.
- [ ] Drag in JPG, PNG and HEIC images → thumbnails appear. HEIC files are converted to .jpg. The 🗑 icon removes an image.
- [ ] Create **P1** (Rings, size 7, 21K, 5 g, quantity 3, one image) → a success message appears and the form clears.
- [ ] Turn **Preserve** on (it highlights) and create **P2** → after saving, only Weight is cleared and a new SKU is generated. The other fields stay filled.
- [ ] Turn Preserve off and create **L1** (Bullion, 24K, 8 g, quantity 5, tag `lira`) and **O1** (Bullion, 24K, 31.1 g, quantity 2, tag `ounce`).
- [ ] Clear → all fields, images and tags are reset.
- [ ] "Back to inventory" → the Inventory page opens.
- [ ] Open the inventory list → P1, P2, L1 and O1 are there. P1's price shows **$475.00**.
- [ ] **Edit:** click ✏️ on P1 → the page reads "Edit product", all fields are filled in, the images load, and Category is disabled.
- [ ] Change P1's name to "Test Ring 21K v2" and save → you go back to Inventory and the new name shows.
- [ ] Edit P1's weight to 6 g and save → the price shows 6 × 95 = **$570.00**. Change it back to 5 g → **$475.00**.
- [ ] ⚠ **Check:** Size and Product images are marked * (required), but Save is enabled without them. Decide if that's acceptable.
- [ ] ⚠ **Check:** click "Print tag" on this page → the tag modal shows **Price: $333.00**. That's a hard-coded value, not the real price.

---

## 7. Inventory — Products (`/admin/inventory/products`)

### List, search, sort, pagination
- [ ] Open the page → you see the filter panel, the summary strip, and the "Inventory items (N)" table. The newest item is first.
- [ ] Each row shows photo, name, price, stock pill ("3 in stock" or "Sold out"), SKU, karat, weight, category, tags button, date added, and actions.
- [ ] Search P1's SKU → only P1 remains. Search "Test" → all test items appear. Search "zzzz" → "No results found".
- [ ] Click the headers (Product, Stock, SKU, Karat, Weight, Category, Added) → each sorts with ▲/▼. The **Date** button toggles newest/oldest.
- [ ] Page size and Next/Prev work, and the summary strip doesn't change when you page.
- [ ] Click the tags icon on L1 → a popover shows "lira". A product with no tags shows "No tags available".

### Filters (they apply by themselves after a short delay)
- [ ] Untick every karat except 21K → only 21K items show, and the summary strip updates.
- [ ] Category = Bullion → only L1, O1 and other bullion show.
- [ ] Stock status: "In stock" is the default. Use "Out of stock" and "Show all" as well → sold-out items only appear under Out of stock or Show all, and their rows are dimmed.
- [ ] Weight 5 to 10 → only items from 5 g to 10 g show.
- [ ] Price 400 to 900 → P1 ($475), P2 ($800) and L1 ($880) show, and O1 ($3,421) is hidden.
- [ ] Reset → all filters go back to their defaults.

### Summary strip math
- [ ] Filter to only P1 (search its SKU) → **1** product, **3** pieces, **15 g**, stock value **3 × $475 = $1,425.00**.

### Scan product
- [ ] Click Scan product, type P1's SKU and press Enter, then do the same for L1's SKU → both appear in the list. Scanning the same SKU twice doesn't add it again. The 🗑 icon removes an item.
- [ ] Click Confirm → the table shows only P1 and L1, and the button changes to "Reset scanner". Click it → the full list comes back.

### Melt (🔥, only shown when stock > 0)
- [ ] Click 🔥 on P1 → a modal shows "Available: 3", quantity 1, "5g each", and "Total to melt: 5.00g".
- [ ] Set quantity to 2 → "Total to melt: **10.00g**" and the button reads "Melt 2 items".
- [ ] Try 0 or a blank value → the button reads "Invalid quantity" and is disabled. A value above 3 is capped at 3.
- [ ] Cancel for now (don't melt yet — you need P1's stock for the POS tests). You'll melt later in section 7b.

### Special price ($)
- [ ] Click $ on P2 → the modal shows "Global 18K price per gram: $80.00", Weight 10g, and Current price $800.00.
- [ ] Enter 100 → "New price: **$1,000.00**" (10 × 100). Click Set price → a success message, and P2's price in the table shows **$1,000.00**.
- [ ] Reopen $ on P2 → the field is pre-filled with 100.
- [ ] Enter 0 or leave it blank → Set price is disabled.
- [ ] Set P2 back to 80 for the rest of the test (or keep 100 and expect $1,000 in the POS).
- [ ] **Later check (section 10):** adding P2 in the POS uses the special $/g.

### Print tag (🖨, needs the DYMO service and a printer)
- [ ] Click 🖨 on P1 → the modal shows the DYMO service status (✓ Running / ✗ Not running), the Printer dropdown, Number of tags, and SKU, Price $475.00, Weight, Karat.
- [ ] Without DYMO running → you see "No DYMO printers detected." / "Not running".
- [ ] With DYMO running: Test DYMO connection → lists your printers. Print 1 tag → the physical tag shows the correct SKU, barcode, weight, karat and size.
- [ ] Set Number of tags to 3 → the button reads "Print 3 tags" and 3 tags print.

### Bulk actions
- [ ] Tick 2 rows → a bar shows "2 items selected". The header checkbox selects every row on the page.
- [ ] Export selected → an .xlsx file downloads containing only those 2 items.
- [ ] Clear → the selection is removed.
- [ ] ⚠ **Check:** "Print tags" in the bulk bar only shows "N tags sent to printer". Nothing actually prints.

### Export
- [ ] Export to Excel → `Products_YYYY-MM-DD.xlsx` downloads and its rows match the current filters.
- [ ] With filters that return nothing → the Export button is disabled.

---

## 7b. Melted Products (`/admin/inventory/melted`)

- [ ] On Inventory, melt **1** of P1 → a success message appears and P1 shows "2 in stock". The summary strip drops by 1 piece and 5 g.
- [ ] Open Melted Products → the 21K card shows the item count going up by 1 and the weight by 5.00 g.
- [ ] The table shows P1's SKU, name, quantity 1, weight 5, 21K, and the date/time melted.
- [ ] Search the SKU → only that record shows. The Date button and the column headers sort the table.
- [ ] Apply is disabled until you pick both dates. Pick today to today and Apply → only today's melts show.
- [ ] Pick a range in the past with no melts → the cards show 0 and the table says "No results found".
- [ ] All time → everything is back. The button is disabled when no date filter is active.
- [ ] **Pricing page:** 21K grams in stock went down by 5 g.

> P1 now has **2** in stock. The POS steps below assume that.

---

## 8. POS Home (`/`) — log in as adminpos@test

- [ ] The header shows "Adi Jewelry POS", your username, a clock, the theme toggle, **Admin Panel** (admin/terminal users only) and Logout.
- [ ] Admin Panel → admin users go to the Dashboard, and terminal-only users go to Inventory.
- [ ] Six cards: Start new sale, Process return, New repair, Repair orders, Used gold, Cash management. Each opens the right page.
- [ ] **Today's sales** is blurred with a 🔒. Click it → a PIN pad titled "View today's sales" appears.
  - [ ] Enter a wrong PIN → the dots turn red, "Wrong PIN" shows, and the entry clears.
  - [ ] ⌫ deletes a digit, and Cancel closes the pad.
  - [ ] Enter `4321` → the value is revealed with a 🔓. It blurs again after **60 seconds**.
- [ ] **Used gold on hand** → same PIN flow. It shows grams, average karat and value.
- [ ] **Store cash box** shows the same balance as Cash Management, plus "+$X today".
- [ ] **In progress repairs** shows a count. Click it → the modal lists them with slot, name, phone, notes, cost, and a due label (Overdue / Due today / Due Mon D). An empty list shows "No repairs in progress".
- [ ] **Recent transactions** shows the last 8 sales (customer, #serial, amount, Cash/Card/Split tag, Today/Yesterday + time, View). View opens the receipt.

---

## 9. Cash Management (`/cashManagement`) — do this before the sale, so the cash box has money

- [ ] The page shows today's date.
  - ⚠ **Check:** during business hours the date may show **yesterday** (it's built from a UTC date). Compare it with a calendar.
- [ ] The Store and Transfers cards show the balance and today's in/out. They match your baseline.
- [ ] **Manual cash in:** Add cash in stays disabled until you pick a Source and enter an amount > 0. Add $2,000 from "Other" → Store box goes up by **$2,000** and the log shows "+$2,000.00 Manual cash in — Other".
- [ ] **Transfer income:** leave the name empty → "Enter customer name". Enter an amount of 0 → "Enter an amount". Add $500 from "John", destination Lebanon → **Transfers** box goes up by $500. The log shows "Transfer income — John" / "To Lebanon".
- [ ] **Add expense:**
  - [ ] With no category → "Select a category". No amount → "Enter an amount". No notes → "Notes are required".
  - [ ] Enter an amount larger than the store balance → "Store box only has $X".
  - [ ] Supplies $50 with a note → Store box goes down by **$50** and the log shows "-$50.00 Expense — Supplies".
  - [ ] Owner Withdrawal $100 → a PIN pad "Owner authorization" appears. A wrong PIN is rejected. Cancel → nothing is saved. With the correct PIN → Store box goes down by $100.
- [ ] **Move money:** Store → Transfers $200 → Store −$200 and Transfers +$200. The log shows 2 rows (Move to / Move from). Moving more than the box holds → "… box only has $X".
- [ ] **Math:** Store = baseline + 2,000 − 50 − 100 − 200. Transfers = baseline + 500 + 200.
- [ ] Transaction log: the Box filter (All / Store / Transfers), search, sorting by Date/Box/Amount and pagination all work.
- [ ] The Cancel and × buttons on each modal close it without saving. Reopening a modal shows an empty form.
- [ ] **Admin Dashboard:** the Store cash box and Transfers box cards match these balances.

---

## 10. POS Sale (`/sale`)

### Screen and cart basics
- [ ] Open New Sale → the top bar has Notes, Bullions, Exchange, Trade-in, Scan and Back to POS. The Cart says "Cart is empty" with an "Add first item" button.
- [ ] The right side has Customer, Discount, Payment, Summary, a disabled "Save Sale" button, and Cancel.

### Customer
- [ ] Type "Test Cust" → after a short pause the matches appear. Type "zzz" → "No customers found".
- [ ] Select Customer A → a card shows initials, name, a tier badge (REGULAR/BRONZE/…), phone, email, birthday, "N items" and "$X lifetime". The ✕ clears it.
- [ ] Click + New customer and save a brand-new customer → it's selected automatically.
- [ ] Click + New customer with Customer A's existing phone → "Customer 'Test Customer A' already exists and has been selected."

### Adding items
- [ ] Click Scan, then scan or type P1's SKU and Enter → Confirm → P1 appears in the cart: Qty 1, Avail 2, Weight 5, $/g 95, Subtotal **$475**.
- [ ] Scan a SKU that doesn't exist → a ⚠ "Product not found" warning. The button changes to "Proceed" and the bad SKU is skipped.
- [ ] Scan a sold-out SKU → "This product has no quantity".
- [ ] Click **Bullions** → a panel with Liras (L1 shown with its stock) and Ounces (O1). Click L1 → it's added (Subtotal **$880**). The card shows as selected, and clicking it again doesn't add it twice.
- [ ] A group with no stock shows "No items in stock". Clicking a group header collapses it.
- [ ] Click **Add item** and create "Manual Bangle", Bangles, 21K, 7 g, quantity 2 → "Add to Cart" is disabled until the name, category and weight are filled. After adding, the row shows $/g **95** and subtotal **7 × 95 = $665**.

### Line editing and calculations
- [ ] Set P1's Qty to 2 → subtotal **2 × 5 × 95 = $950**. Qty 3 is refused (only 2 available).
- [ ] Change P1's weight to 5.5 → subtotal **2 × 5.5 × 95 = $1,045**. Put it back to 5.
- [ ] Change P1's $/g to 100 → an "Apply to all 21K" link appears (because the Manual Bangle is also 21K). Click it → the bangle's $/g becomes 100 as well. Put both back to 95.
- [ ] Remove the Manual Bangle and L1 with ✕ → the cart and totals update.

**Cart for the main sale: P1 × 2 + P2 × 1**
- [ ] Subtotal = 2 × 475 + 800 = **$1,750.00** (or $1,950 if P2 still has the $100/g special price).

### Discount
- [ ] Set 10 with type % → Discount **−$175.00**, Customer pays **$1,575.00**.
- [ ] A % value over 100 is capped at 100.
- [ ] Switch to $ and enter 50 → Discount −$50.00, Customer pays **$1,700.00**.
- [ ] Use **10%** for the main sale → **$1,575.00**.

### Payment
- [ ] Cash (default) → Cash = 1575, Card = 0 (disabled).
- [ ] Card → Card = 1575, Cash = 0 (disabled).
- [ ] Split: type Cash = 1000 → Card fills in **575** by itself. Typing more than the total is capped at the total.
- [ ] The Save button reads "Save sale — $1,575.00".
- [ ] Save stays disabled when: there's no customer, the cart is empty, a line has weight or $/g of 0, or a quantity is over the available stock.
- [ ] Notes → type "Test sale note" and click Done → the note is kept.

### Complete the sale (Split: Cash 1000 / Card 575)
- [ ] Click Save → a loading screen and a success message. About 3 s later the **Receipt Preview** opens.
- [ ] **Receipt:** store address and phone, Trans ID, date, time, your staff name, Customer A, Payment "Cash & Card".
- [ ] The receipt lines show P1 (qty 2, 5g, $95, subtotal) and P2, with their SKUs and karat.
- [ ] Total Before Discount **$1,750.00**, Discount **$175**.
- [ ] Payment breakdown: Cash $1000, Card $575. Total (incl. 5% GST) **$1575**.
- [ ] Turn on **Gift receipt** → every price, subtotal, discount and total disappears, and a "Gift Receipt" badge shows.
- [ ] Click **Print** (needs the Epson/print agent) → the thermal receipt prints and matches the preview.
- [ ] Close the receipt → the sale form resets: empty cart, no customer, discount 0, Cash.

### Check other pages after the sale
- [ ] **Inventory:** P1 shows **0** in stock / Sold out (it only appears under "Show all" or "Out of stock"). P2 is sold out.
- [ ] **Inventory:** "Manual Bangle", if you sold it, is now a real product with a new SKU and stock = 2 − 1 = **1**.
- [ ] **Customers:** Customer A's Items goes up by 3, Total purchases goes up by $1,575, and Last purchase = today. Purchase history lists the sale with −$175 discount and $1,575, and View receipt works.
- [ ] **POS Home:** Recent transactions shows Customer A $1,575.00, a **Split** tag and "Today". Today's sales (after the PIN) goes up by $1,575 and 1 transaction.
- [ ] **Cash Management:** Store box goes up by **$1,000 only** (the cash part). The log shows "Sale #… — Cash payment". The Transfers box doesn't change.
- [ ] **Admin Dashboard:** Sales revenue +$1,575, transactions +1, Today's payments Cash $1,000 / Card $575, Items sold +3, Discounts given +$175, Gold sold today 21K 10 g and 18K 10 g, Top category.
- [ ] **Pricing:** 21K and 18K grams in stock went down by the grams sold.

### More sales to run
- [ ] **Card-only sale:** Customer B buys L1 ($880), Card → Store box doesn't change and the receipt says Payment "Card".
- [ ] **Cash sale with a $ discount:** O1 $3,421 − $21 → pays **$3,400**, Cash → Store box +$3,400.
- [ ] **Trade-in sale:** add L1 ($880). Trade-in → the rows 24/22/21/18/14/10K are all empty. Enter 21K, 3 g, $60/g → Credit **$180**. "Apply credit" is disabled until a row has both weight and price.
  - [ ] "+ Add karat row": 9K works. 25K or 0 gives "Enter a karat between 1 and 24", and an existing karat gives "21K already exists in the list".
  - [ ] After Apply → an amber "Trade-in credit −$180.00" panel (21K 3.0g) with Edit and Clear. The Summary shows "Trade-in credit −$180.00" and Customer pays **$700.00**.
  - [ ] Clear → the credit is removed and the total goes back to $880.
  - [ ] Save the sale → the receipt total is **$700**.
  - [ ] ⚠ The traded-in gold itself is **not** recorded anywhere (not in Used Gold). Confirm that's what you want.
- [ ] **Credit bigger than the sale:** a trade-in credit above the subtotal → the Payment section disappears and the Summary shows "Cash owed to customer $X". The button reads "Save sale — pay customer $X".
- [ ] **Even exchange:** credit exactly equal to the subtotal → "Even exchange — no payment needed" and "Save sale — even exchange".

---

## 11. Exchange (inside POS Sale)

Before you start, make sure a previous sale exists with an item you can return (for example, sell the "Manual Bangle", 1 unit, for $665).

- [ ] Click **Exchange** → a modal says "Search for the original transaction".
- [ ] Search by customer name, by phone digits, and by receipt # (with a dash) → the matching sales are listed with date, amount, customer, phone and serial. Nonsense → "No transactions found".
- [ ] Pick the sale → its items are listed. Items already fully returned show a "Fully returned" badge and can't be selected.
- [ ] Tick the bangle → the controls appear. The button text tells you what's missing ("Select condition & destination … & reason …").
- [ ] Reason "Other" → a text box appears and becomes required.
- [ ] Qty to return is capped at the quantity purchased. The amount is capped at qty × unit price.
- [ ] **Math:** unit price = line subtotal after discount ÷ quantity. For a $665 bangle, qty 1 → credit **$665.00**. Lower the amount to $600 → the credit shows $600.
- [ ] Apply → a red panel "Exchange credit · <serial>" appears with 📦/🔥 and the amount. The Summary shows "Exchange credit −$600.00".
- [ ] Add a new item (L1 $880) → Customer pays **$280**. Save.
- [ ] **Receipt:** there's an "Items Returned in Exchange" section (−$600.00) and "Exchange Credit: −$600.00".
- [ ] **Original sale receipt** (Customers → history → View receipt): shows a "Returned" column with 1 pcs / $600.
- [ ] **Stock:** with "Return to stock", the bangle's stock goes up by 1. With "Melt", it appears in Melted Products instead.
- [ ] **Return Management:** the item appears (NEEDS TAG if returned to stock, MELT if melted).

---

## 12. Returns (`/return`)

- [ ] Open Process return → there are Name / Phone / Receipt # tabs and "Enter a search term to find transactions".
- [ ] Switch tabs → the search box clears and its placeholder changes.
- [ ] Name tab "Test Customer A" → the matching sales appear and "N transactions found" shows. A name that doesn't exist → "No transactions found".
- [ ] The Phone and Receipt # tabs find the same sale.
- [ ] Open the main sale ($1,575, P1 × 2 + P2) → the items appear. The right side shows Customer, Phone, Date, Paid by "Cash + Card", Original total, and View receipt.
- [ ] Refund summary says "No items selected" and the button is disabled.
- [ ] Click P1 → it becomes selected with quantity 2 and amount = 2 × unit price.
- [ ] **Math:** the unit price includes the discount. P1 line = $950 − 10% = $855 → unit price **$427.50**. Qty 2 → **$855.00**.
- [ ] Set qty to 1 → **$427.50**. Try an amount above $427.50 → it's capped at $427.50. Clear the qty and click away → it becomes 1.
- [ ] Without a reason, condition or destination → "Fill in reason, condition, and return option for all selected items" and the button is disabled.
- [ ] Reason = Wrong size, Condition = Good, **Return to stock** → the button reads "Process return — $427.50".
- [ ] Click it → the Refund payment modal shows $427.50. Confirm stays disabled until you pick Cash or Card.
- [ ] Pick **Cash** → Confirm → a success message and you go back to search.
- [ ] Return 1 of P2 as well with **Melt**, refunded by **Card**.

### Check other pages after the return
- [ ] **Inventory:** P1's stock goes up by 1 (Return to stock). P2 stays sold out (melted).
- [ ] **Melted Products:** P2 appears (18K, 10 g).
- [ ] **Cash Management:** Store box goes down by **$427.50** and the log shows "Return — Sale #…". The card refund doesn't change any box.
- [ ] **The sale's receipt:** a Returned column (1 pcs $427.50), and "Total Returned Amount" shows.
- [ ] **Search the same sale again:** P1 shows "1 already returned". Once everything is returned → "Fully returned" and it can't be selected.
- [ ] Try to return more than is left → it's blocked (the quantity is capped, or the server shows an error).
- [ ] **Admin Dashboard:** Refunds paid out goes up by the refund, with "N returns · X to stock, Y to melt".
- [ ] **Sales Reports:** the Refunds card goes up, and Net = revenue − refunds.

---

## 13. Return Management (`/admin/returnManagement`)

- [ ] Open the page → tabs **Needs tags / Printed / All returns**, each with a count. P1 (returned to stock) is under Needs tags with a "NEEDS TAG" badge.
- [ ] The melted P2 has a **MELT** badge, can't be selected, and has no Print button (All returns tab).
- [ ] Rows are grouped by day (Today / Yesterday / date) with "Select all (N)".
- [ ] Each row shows name, qty, badges, condition, karat, weight, SKU, reason, customer, sale serial, amount and time.
- [ ] Search by SKU, customer or receipt → the list filters. The "Newest first / Oldest first" button reverses the order.
- [ ] Tick an item → a bar shows "1 item selected for tag printing" with Print 1 tag and Clear.
- [ ] Click Print → the tag modal opens with the tag count = quantity returned. After a successful print, the item moves to **Printed** with a "TAG PRINTED" badge and "Printed Today", and the counts update.
- [ ] Printed items show a **Reprint** button.
- [ ] Empty Needs tags tab → "No items waiting for tags — All returned items have their tags printed."
- [ ] **Admin Dashboard → Needs attention:** "N returned items need tags printed" shows while any are pending and disappears when there are none.

---

## 14. New Repair (`/repair`)

- [ ] Open the page → Repair notes (0/1000), Cost, Payment (Unpaid / Cash / Card / Split), Customer *, Slot assignment ("Slot N — Next available"), Due date *, the "Receiver is different" checkbox, and Save.
- [ ] With nothing filled in, the Save button reads "Missing: customer, notes, due date" and is disabled.
- [ ] Customer search shows name and phone. "+ New customer" creates one and selects it.
- [ ] You can't type in the due date field; it only accepts the picker. Past dates can't be picked.
  - ⚠ **Check after 6 pm:** see whether you can still pick *today*. The date limit is based on UTC.
- [ ] Cost only accepts whole numbers. The decimal key is blocked and the value is limited to 8 digits.
- [ ] **Payment math (Cost = 120):**
  - [ ] Unpaid → "Unpaid — $120.00 due at pickup".
  - [ ] Cash → Cash 120 (read-only) and "Paid in full — cash".
  - [ ] Card → Card 120 and "Paid in full — card".
  - [ ] Split, type Cash 50 → Card fills in **70** and "Fully paid — split $50.00 cash / $70.00 card". Cash 150 is capped at 120 with Card 0.
- [ ] Tick "Receiver is different" → a name box appears (max 100 characters).
- [ ] Notes can't go past 1000 characters, and the counter updates.
- [ ] Save (Customer A, notes "Ring resize to 7", cost 120, **Unpaid**, due tomorrow, receiver "Sam") → a success message and the **Repair Invoice** opens: Repair Code, Due Date, Customer, Phone, Receiver: Sam, Cost $120.00, Slot N, social links and QR.
- [ ] Turn on "Store owner view" → the notes appear and the footer is hidden.
- [ ] "Print both copies" is on → Print Invoice prints 2 copies (customer and store). Turn it off → it prints only the current view.
- [ ] After closing, the form resets and the slot moves to the next number.
- [ ] Create a second repair, **Cash** $80, due today.
- [ ] Create a third repair, due tomorrow, then **change its due date to the past later** (or use an old one) to test Overdue.
- [ ] Cancel → you go back to the previous page.
- [ ] **Cash Management:** ⚠ Store box does **not** change for a repair paid in cash. Record it yourself with Manual cash in → "Repair payment" if that's the intended process.

---

## 15. Repair Orders (`/repairOrders`)

- [ ] Open the page → the header says "N active repairs". Stats: In progress, Done, Awaiting call, Unpaid ($ total of unpaid).
- [ ] **Math:** Unpaid = the sum of costs of unpaid active repairs (for example $120 from repair #1).
- [ ] The In progress column shows cards with code, slot, 🧾, name, phone, notes, cost, a due badge (Due today / Due tomorrow / Due Mon D / Overdue N days) and Paid/Unpaid.
- [ ] Search by name, by phone, or by repair code → the columns filter.
- [ ] The filter dropdown: All active / In progress / Done / Awaiting call / Notified → the right columns show.
- [ ] **Details** → customer, phone, receiver, code, slot, cost, payment, due date, status, dropped off, days in shop, notes, and a timeline.
- [ ] **Edit** → change the cost to 150 and the notes, then Save → the card shows $150.00 and a "<code> updated" message.
  - [ ] Change Unpaid → Paid → a Payment method appears. Save is disabled until you pick one. Split 100 / 50 works. A mismatched split shows "$X remaining" or "Amounts exceed total".
- [ ] **Mark ready** → a "Repair done" modal with three choices:
  - [ ] **Not yet** → the card moves to Done with an "Awaiting call" badge, and the Awaiting call stat goes up by 1.
  - [ ] **Notified** button on that card → the badge becomes "Notified" and "Called today".
  - [ ] **Text customer** (use your own phone number) → an SMS arrives, the success toast says "texted", and "Text again" is available.
- [ ] **Picked up** on an **unpaid** repair → the "Collect payment" modal shows the cost. Confirm stays disabled until you pick a method. Pick Cash → Confirm pickup → the repair leaves Active.
- [ ] Picked up on a **paid** repair → it moves straight to Completed.
- [ ] **Completed** tab → cards show "Picked up", Ordered date, Cost, Picked up date, and Paid method.
- [ ] **Cancel repair** (from Edit) → a browser confirm dialog. OK → it's in Completed with a "Cancelled" badge and the cancelled date.
- [ ] 🧾 on any card → the Repair Invoice opens.
- [ ] Empty states: "No repairs in progress", "No finished repairs waiting", "No completed repairs found".
- [ ] **Check other pages:**
  - [ ] **POS Home** In progress repairs count and its overdue count are correct.
  - [ ] **Admin Dashboard:** Repairs collected today = the amount paid, "N repairs taken in today". The Repairs panel (In progress / Awaiting call / Due today / Overdue / Unpaid balance) matches the board. Needs attention shows "N repairs overdue" and "N repairs done, customer not called yet".
  - [ ] **Repairs Reports** (section 18) include these repairs.
- [ ] Slots: after a repair is picked up or cancelled, its slot number becomes available again for new repairs. The maximum is 150; when all are taken, saving shows "no slots available".

---

## 16. Used Gold — POS purchase (`/usedgold`)

- [ ] Open the page → karat rows 24, 22, 21, 18, 14 and 10K with Weight, $/gram and Subtotal. The right side has Seller *, Payment method (Cash / E-Transfer), Notes, Summary and the Save button.
- [ ] With nothing entered → "Add gold items to start". With items but no seller → "Select a seller".
- [ ] Add karat row: 9K with $30 → the row is added in karat order. 25 → "Karat must be between 1 and 24". An existing karat → "21K already exists". The ✕ on a row removes it.
- [ ] Seller search finds customers. "+ New seller" opens the modal titled "Add new seller" and selects the seller after saving.
- [ ] **Math:** 21K 10 g × $60 = **$600**, 18K 5 g × $50 = **$250** → Pay to seller **$850.00**, Total weight **15.00 g**. The header shows "2 items · 15.00g".
- [ ] A row with a weight but $0/g isn't counted in the total.
- [ ] Cash → the button reads "Pay $850.00 — cash out". Save → a success message and the form resets.
- [ ] **E-Transfer** purchase: 24K 2 g × $70 = $140.
  - ⚠ The screen says "E-Transfer out from **store** box", but the money is taken from the **Transfers** box. Check which one is correct.
- [ ] Try a cash purchase larger than the Store box balance → it's refused with an insufficient balance error.
- [ ] Cancel → the form resets.
- [ ] **Cash Management:** Store box goes down by **$850** and the log has a row "Used gold purchase #N". The Transfers box goes down by $140.
- [ ] **POS Home → Used gold on hand** (after the PIN) goes up by 17 g.
- [ ] **Admin Dashboard:** "Used gold bought" today = **$990**, "17.0g across 2 purchases". Used gold on hand goes up.

---

## 17. Used Gold — Admin (`/admin/usedGold`)

- [ ] Open the page → Period (Month / Year / All time) with month and year pickers. Six stat cards, the gold pool cards (24, 22, 21, 18, 14, 10K), and "Other purities" if you bought 9K.
- [ ] **Math:**
  - [ ] On hand = sum of pool grams (15 + 2 = **17.0 g** from the test).
  - [ ] Avg purity = Σ(karat × grams) ÷ total grams = (21×10 + 18×5 + 24×2) ÷ 17 = 348 ÷ 17 = **20.5K**.
  - [ ] Spent (this month) = **$990**, Purchases = **2**.
- [ ] The 21K pool shows 10.0 g and $600, and the 18K pool shows 5.0 g and $250.
- [ ] History lists the purchases (red cost, PURCHASE badge). The type filter, search, sorting by Date/Karat/Weight/Cost/Type and pagination all work.
- [ ] Switch to a past month with no activity → Spent $0, Purchases 0, and history is empty.
- [ ] **Return to stock:**
  - [ ] "Add to inventory" stays disabled until the name, category, karat and weight are filled.
  - [ ] The karat list shows the grams available, and karats with 0 g are disabled.
  - [ ] Weight is capped at what's available. It shows "Available: 10.00g at $60.00/g".
  - [ ] Add 21K 4 g as "Used 21K chain" (Necklaces) → a success message "4.00g 21K added to inventory (SKU)". The 21K pool drops to 6 g, and history shows STOCK.
  - [ ] **Inventory:** "Used 21K chain" appears as a new product with a SKU, 4 g and 21K.
- [ ] **Send to melt:**
  - [ ] Disabled when nothing is on hand.
  - [ ] The modal lists every pool and "Total in drawer 13.00g — $X".
  - [ ] Bag weight 0 → "Enter bag weight". A bag weight above the drawer total + 0.5 → "Weight exceeds…".
  - [ ] Enter 13 with dealer notes → Confirm melt → all pools go to 0 and history shows MELT.
- [ ] **Admin Dashboard / POS Home:** Used gold on hand goes to 0.

---

## 18. Reports

### Sales Reports (`/admin/sales-reports`) — Admin only
- [ ] Period buttons: Today, This week, This month, This year, All time. Custom date range with Apply.
- [ ] **Today** after your test sales:
  - [ ] Total revenue = the sum of today's sale totals, with the transaction count.
  - [ ] Refunds = today's refunds, and Net = revenue − refunds.
  - [ ] Items sold + grams. Avg sale = revenue ÷ transactions.
- [ ] Cash collected + Card collected = revenue (before refunds). The % of payments add up to 100%.
- [ ] Discounts given = the sum of discounts. The "% of revenue" = discounts ÷ revenue × 100.
- [ ] Avg price per gram shows 21K ≈ $95 and 18K ≈ $80 (or your override prices).
- [ ] The charts (Revenue over time, Items sold over time, Sales by category) show data. The expand ⤢ button opens a bigger modal with the period label.
- [ ] Gold sold by karat shows the grams per karat and $/g. Top customers lists Customer A.
- [ ] **Items sold** table: each sold line with SKU, product, customer, Sale ID, Qty, Weight, $/g, Subtotal. Search, sorting and pagination work.
- [ ] Pick a date range with no sales → $0 and "No data available".
- ⚠ **Check after 6 pm:** the default date inputs may show *tomorrow's* date (built from UTC).

### Inventory Reports (`/admin/inventory/reports`)
- [ ] **Stock right now:**
  - [ ] Items in stock (across N categories), Total weight, Stock value (at current sell prices), Avg item age.
  - [ ] Total weight and stock value should match the Inventory summary strip with filters reset and "In stock".
- [ ] Stock by purity, Stock by category, and Inventory aging bars show data.
- [ ] **Movement (period):**
  - [ ] Items added (+ g), Items sold, Items returned (back to stock), Melted — each matches what you did today.
  - [ ] Today: added = the products you created, sold = the pieces sold, returned = P1 × 1, melted = P1 × 1 + P2 × 1.
- [ ] **Bullions sold** lists L1 and O1 with the number sold. L1's status is **LOW — reorder** when stock < the threshold (10), otherwise OK.
- [ ] Items added / returned by purity match.

### Repairs Reports (`/admin/repairs/reports`)
- [ ] View: Month (with month and year pickers) / Year / All time, plus a custom range.
- [ ] Total repairs, Revenue collected, Expected revenue (= collected + unpaid), Unpaid (+ count), Avg repair value, Avg turnaround.
- [ ] **Math:** Expected revenue = Revenue collected + Unpaid.
- [ ] The "⚠ Needs attention" box lists overdue repairs.
- [ ] The chart shows data. On-time completion, Collection rate and Cancellation rate show "X of Y" and make sense (for example "1 of 3 cancelled").
- [ ] Revenue by customer, Avg repair value history, Repeat customers and Longest in shop list data, or their empty messages.

### Customers Reports (`/admin/customers-reports`) — Admin only
- [ ] Total customers (+new this year), Repeat customers, Avg lifetime value, Going quiet.
- [ ] **Customer tiers:** click a tier → a modal lists its members. The counts should match the tier badges on the Customers page.
  - ⚠ Tier totals are shown in millions ("$0.0M") — small numbers will look like zero.
- [ ] "Going quiet" lists big spenders with no purchase in 90+ days, or "No customers at risk".
- [ ] Period section: Active customers, New customers, Avg spend per customer, Avg discount given. The New customers chart and New vs returning revenue bars show data.
- [ ] Top customers table: search and sorting work.

---

## 19. Analytics (`/admin/analytics`) — Admin only

- [ ] The page shows Refresh, report type buttons (All time / Daily / Weekly / Monthly / Yearly), a date range, Apply and Reset.
- [ ] The summary cards (Avg daily sales, Best selling category, Top performer, Most valuable karat) match your data.
- [ ] Revenue over time, Units sold over time, Sales by category, Customer retention, Staff performance (sales · commission) and Gold price over time (lines per karat) all show data, or "No data available".
- [ ] After changing prices in Pricing, the Gold price over time chart shows the change.
- [ ] Apply a date range → the charts update. Reset → back to the defaults. Refresh → the data reloads.

---

## 20. Admin Dashboard (`/admin/dashboard`) — full check after all activity

Compare against your baseline plus everything you did today.

- [ ] **Sales revenue:** today's total, transaction count, and ▲/▼ % vs yesterday.
- [ ] **Repairs collected:** the amount paid for repairs today, the payment count, and repairs taken in today.
- [ ] **Refunds paid out:** −$ total, number of returns, to stock / to melt split.
- [ ] **Used gold bought:** $ total, grams, and number of purchases.
- [ ] **Store cash box** = the Cash Management store balance, with +in / −out today.
- [ ] **Transfers box** = the Cash Management transfers balance.
- [ ] **Used gold on hand:** grams, avg karat and invested value (matches the Used Gold admin page).
- [ ] **Stock value:** $, items and grams (matches Inventory Reports "Stock right now").
- [ ] **Sales — last 14 days:** today's bar is highlighted. ⚠ The labels are in $k, so small amounts show as "$0k".
- [ ] **Today's payments:** Cash + Card = total, Items sold + grams, Discounts given (on N sales), Avg sale, and Customers (+ added today).
- [ ] **Repairs panel:** In progress / Awaiting call / Due today / Overdue / Unpaid balance match Repair Orders.
- [ ] **Gold sold today by karat** plus the top category.
- [ ] **Needs attention:** overdue repairs, repairs not called yet, returned items needing tags. When there are none → "Nothing needs attention right now."
- [ ] Refresh → the same numbers appear.

---

## 21. Staff (`/admin/staff`, `/admin/addStaff`, `/admin/editStaff/:id`)

### Staff list
- [ ] The stat cards (Total staff, Admins, POS terminals, Active now) match the list.
- [ ] Table: avatar + name + email, role pills, phone, created date, Active/Inactive, Edit and 🗑.
- [ ] The role filter lists all roles. The status filter (All / Active / Inactive), search (name, email, phone), sorting by Name and Created At, and pagination all work.
- [ ] Click the **Active** pill → it becomes Inactive, the row is dimmed and the stats update. Click again → Active.
- [ ] 🗑 (Admin only, disabled for inactive users) → "Remove staff member?" → Remove → the user becomes Inactive.
  - ⚠ The dialog says "cannot be undone", but it's the same as deactivating — clicking the status pill restores the user. Check which behaviour you want.
- [ ] A deactivated user can't log in (section 1).

### Add staff
- [ ] Save is disabled until: full name, a valid email, a password of 6+ characters with an uppercase letter and a special character, and at least one role.
- [ ] The password rules turn green as you meet them. The eye icon shows/hides the password. Spaces can't be typed in email or password.
- [ ] The Username field copies the email. The phone is optional but must be 10 digits if you enter it.
- [ ] Create each test user from section 0 → a success message. They appear in the list with the right roles.
- [ ] Use an email that already exists → an error message.
- [ ] Clear resets the form. Back to staff returns to the list.

### Edit staff
- [ ] Click ✏️ → the form is filled in (no password field). Change the name or phone or roles and save → a success message, and the list shows the change.
  - ⚠ After saving, the form **clears and you stay on the page**, unlike Edit Product, which goes back to the list.
- [ ] Edit **your own** account → the Roles and Status controls are disabled, with "You can't edit your own roles" / "You can't deactivate your own account".

---

## 22. Roles and permissions

Log in as each user and check what they can and can't reach.

**PosRole only (pos@test)**
- [ ] It can use `/`, `/sale`, `/return`, `/repair`, `/repairOrders`, `/usedgold` and `/cashManagement`.
- [ ] The POS header has **no** Admin Panel button.
- [ ] Typing `/admin/dashboard` or `/admin/inventory/products` → the Unauthorized page.

**TerminalRole only (terminal@test)**
- [ ] It lands on Inventory. The sidebar shows only Inventory, Reports, Pricing, Customers, Used Gold and Return Management.
- [ ] Inventory has **no** Add product button and **no** Edit ✏️. Melt, Special price and Print are available.
- [ ] Pricing, Customers, Used Gold, Return Management, Inventory Reports and Repairs Reports open fine.
- [ ] `/admin/dashboard`, `/admin/sales-reports`, `/admin/customers-reports`, `/admin/analytics`, `/admin/settings`, `/admin/logs` and `/admin/staff` → Unauthorized.
- [ ] ⚠ **Check:** clicking **Reports** in the sidebar opens *Sales Reports* first, which terminal users aren't allowed to see → you'll likely land on Unauthorized. The Sales and Customers sub-items will do the same.
- [ ] ⚠ **Check:** the sidebar shows a **POS** link for terminal users, but the POS pages require PosRole → it probably leads to Unauthorized.
- [ ] ⚠ **Check:** `/admin/addProduct` typed directly is still allowed for terminal users even though the button is hidden.

**StaffManager only (staffmgr@test)**
- [ ] It lands on Staff. The sidebar shows only Staff and Add Staff.
- [ ] It can add and edit staff. The **StaffManager** role is not offered in the role list. There's **no** 🗑 Remove button.
- [ ] Every other admin URL → Unauthorized.

**Admin (admin@test)**
- [ ] It can open every admin page. Without PosRole, opening `/` → Unauthorized.

---

## 23. Logs (`/admin/logs`) — Admin only, not in the sidebar (type the URL)

- [ ] The page shows "Application Logs": a table with Timestamp, Level, Handler, Message, request, Exception, User, Correlation and Actions.
- [ ] Search and the level filter (All / Info / Warning / Error) work.
- [ ] Cause an error (for example the duplicate customer phone) → a new Error/Warning row appears.
- [ ] The view buttons open a modal with the full Message, Exception or Request.
- [ ] Delete one log → it's removed. Delete with nothing selected → "No logs selected to delete". Delete-all asks first and then clears the logs.

---

## 24. General checks (do them on any page)

- [ ] Refresh (F5) on every page → it still loads and you stay logged in.
- [ ] Browser Back/Forward between pages → no blank screens.
- [ ] Every modal closes with ✕, Cancel, and a click outside it (where that's allowed), and reopens with a clean form.
- [ ] Stop the API server and use the app → error toasts appear, with no white screen. Start it again → the app works.
- [ ] Dark and light theme look right on the POS and admin pages, including the modals and receipts.
- [ ] Tablet width: the POS pages are usable and the buttons are big enough.
- [ ] Money always shows 2 decimals and weights show "g".
- [ ] Dates and times show Edmonton local time (compare a sale's time with your clock).

---

## Things to look at closely

I noticed these while reading the code. They may be intended, so confirm each one:

1. **GST:** no tax is calculated anywhere, but the receipt says "Total (incl. 5% GST)". Confirm prices are meant to include GST.
2. **Repair payments** made in cash never add to the Store cash box (only sales do). Manual cash in has a "Repair payment" option, so that may be the intended workaround.
3. **Used gold by E-Transfer** says "out from store box" on screen, but the money is taken from the Transfers box.
4. **Trade-in gold** in a sale only lowers the total. The gold isn't added to Used Gold.
5. **Bulk "Print tags"** on Inventory only shows a message; nothing prints.
6. **Add Product → Print tag** shows a hard-coded price of $333.
7. **Add Product:** Size and Images are marked required but aren't enforced.
8. **Terminal role:** the Reports and POS sidebar links point to pages that role can't open.
9. **Staff "Remove"** says it can't be undone, but it's only a deactivate.
10. **Edit staff** clears the form after saving instead of going back to the list.
11. **Dates built from UTC** (Cash Management header date, Sales Reports default dates, repair due-date minimum): expect the wrong day in the morning or after 6 pm Edmonton time.
12. **Editing a product's weight in the POS cart** permanently changes that product's weight in Inventory after the sale.
13. **Customers Reports tier totals** show in millions ($0.0M).

---

## Final System Checklist

- [ ] Login works (all roles, remember me, logout)
- [ ] Every page opens correctly
- [ ] Every important button works
- [ ] Every form works
- [ ] Validation works
- [ ] Search works
- [ ] Filters work
- [ ] Tables work (sorting)
- [ ] Pagination works
- [ ] Products work (add, edit, SKU, images, tags, special price, melt)
- [ ] Inventory works (quantities and weights change correctly after sales, returns and melts)
- [ ] Bullion works (Liras/Ounces in POS, low stock flag)
- [ ] Customers work (add, edit, duplicate check, history, tiers)
- [ ] POS works (cart, discount, trade-in, exchange)
- [ ] Payments work (cash, card, split; cash goes into the store box)
- [ ] Returns work (refund amount, stock/melt, cash box, receipt)
- [ ] Return Management / tag printing works
- [ ] Repairs work (intake, invoice, board, notify, SMS, pickup, cancel)
- [ ] Used Gold works (POS purchase, pools, return to stock, melt)
- [ ] Cash Management works (expense, owner PIN, move, transfer, manual cash in)
- [ ] Pricing works (and the POS uses the new prices)
- [ ] Reports work (Sales, Inventory, Repairs, Customers, Analytics)
- [ ] Dashboard numbers are correct (admin and POS home)
- [ ] Printing/receipts work (sale receipt, gift receipt, repair invoice, DYMO tags)
- [ ] Roles/permissions work
- [ ] Settings work (PIN, low stock threshold)
- [ ] Error messages work
- [ ] Empty states work
- [ ] No obvious broken functionality remains
