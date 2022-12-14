import { Ticket } from '../models/Ticket';

// mongoose-update-if-current will update the document only if the version is match (0!) after the update it also update the version propery to 1
// so in the second time we try to update the ticket the version in the database will be 1.
// keep in mind that this instace of the ticket is still hold an older version (0) so this call is going to fail with error
// " No matching document found for id "..." version 0 "

it('implements mongoose-update-if-current (OCO: optimistic concurrency control)', async () => {
  // Creating a ticket (with version 0)
  const ticket = Ticket.build({
    title: 'Valid Title',
    price: 5,
    userId: '123',
  });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id); // (version 0)
  const secondInstance = await Ticket.findById(ticket.id); // (version 0)

  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 15 });

  // this update will success, beacuse we have a match between the 'versions'
  await firstInstance?.save();

  try {
    // this update will failed, beacuse we have a no match between the 'versions'
    await secondInstance?.save();
  } catch (error) {
    return;
  }
  throw new Error('Should not reach this point');
});

it('increments version number on multiole saves', async () => {
  const ticket = Ticket.build({
    title: 'Valid Title',
    price: 5,
    userId: '123',
  });
  await ticket.save();

  expect(ticket.version).toBe(0);

  ticket?.set({ price: 10 });
  await ticket.save();

  expect(ticket.version).toBe(1);

  ticket?.set({ price: 15 });
  await ticket.save();

  expect(ticket.version).toBe(2);
});
