const db = require('./db');

// https://regexr.com/
const toMatch = /\w{8}[-](\w{4}[-]){3}\w{12}/g;
exports.getAll = async (req, res) => {
  const emails = await db.selectEmails();
  if (Object.keys(req.query).length === 0) {
    res.status(200).json(emails);
  } else {
    if (req.query.mailbox == 'starred') {
      let starred = await db.selectStarredEmails();
      for (let i = 0; i < starred.length; i++) {
        starred[i].date = new Date(starred[i].received);
      }
      starred = starred.sort((a, b) => b.date - a.date);
      for (let i = 0; i < starred.length; i++) {
        delete starred[i].date;
      }
      const final = [{'name': 'starred', 'mail': starred}];
      res.status(200).json(final);
      return;
    }
    let found = false;
    const reqBox= [];
    for (let i = 0; i < emails.length; i++) {
      if (emails[i].name == req.query.mailbox) {
        reqBox.push(emails[i]);
        found = true;
        break;
      }
    }
    if (found) {
      // here were adding a new date property so we can sort
      // we are then deleting it :(
      // kind of a waste but it works for me
      let mail = reqBox[0].mail;
      for (let i = 0; i < mail.length; i++) {
        mail[i].date = new Date(mail[i].received);
      }
      mail = mail.sort((a, b) => b.date - a.date);
      for (let i = 0; i < mail.length; i++) {
        delete mail[i].date;
      }
      reqBox[0].mail = mail;
      res.status(200).json(reqBox);
    } else {
      res.status(404).send();
    }
  }
};

exports.getByUUID = async (req, res) => {
  if (req.params.id.match(toMatch)) {
    const email = await db.selectEmail(req.params.id);
    if (email) {
      res.status(200).json(email);
    } else {
      res.status(404).send();
    }
  } else {
    res.status(400).send();
  }
};

exports.getUserMailboxes = async (req, res) => {
  const mailboxes = await db.selectUserMailboxes();
  res.status(200).json(mailboxes);
};

exports.getMailboxes = async (req, res) => {
  const mailboxes = await db.selectMailboxes();
  res.status(200).json(mailboxes);
};

exports.deleteByUUID = async (req, res) => {
  if (req.params.id.match(toMatch)) {
    const deleted = await db.deleteEmail(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  } else {
    res.status(400).send();
  }
};

exports.post = async (req, res) => {
  // see if theres a mailbox to put it in
  if (Object.keys(req.query).length === 0) {
    const date = new Date();
    req.body.sent = date.toISOString();
    req.body.received = date.toISOString();
    req.body.from = {'name': '', 'email': ''};
    req.body.from.name ='CSE183 Student';
    req.body.from.email= 'cse183student@ucsc.edu';
    const mail = await db.insertEmail(req.body);
    res.status(201).send(mail);
  } else {
    req.body.sent = '';
    req.body.received = '';
    req.body.from = {'name': '', 'email': ''};
    const mail = await db.insertMailbox(req.body, req.query.mailbox);
    res.status(201).send(mail);
  }
};

exports.put = async (req, res) => {
  if (req.params.id.match(toMatch)) {
    const email = await db.selectWholeEmail(req.params.id);
    if (email) {
      if (req.query.mailbox == 'sent' && email.mailbox != 'sent') {
        // cannot move email into sent unless its already there
        res.status(409).send();
      } else {
        email.mailbox = req.query.mailbox.toLowerCase();
        // set the emails mailbox to the query
        await db.updateEmail(email);
        res.status(204).send();
      }
    } else {
      res.status(404).send(req.params.id+ ' no match');
    }
  } else {
    res.status(404).send(req.params.id+ ' invalid UUID');
  }
};

exports.mark = async (req, res) => {
  if (req.params.id.match(toMatch)) {
    const email = await db.selectWholeEmail(req.params.id);
    if (email) {
      // found the email lets update it
      await db.markEmail(email);
      res.status(204).send();
    } else {
      res.status(404).send(req.params.id+ ' no match');
    }
  } else {
    res.status(404).send(req.params.id+ ' invalid UUID');
  }
};

exports.star = async (req, res) => {
  if (req.params.id.match(toMatch)) {
    const email = await db.selectWholeEmail(req.params.id);
    if (email) {
      // found the email lets update it
      await db.starEmail(email);
      res.status(204).send();
    } else {
      res.status(404).send(req.params.id+ ' no match');
    }
  } else {
    res.status(404).send(req.params.id+ ' invalid UUID');
  }
};

exports.getStarred = async (req, res) => {
  const starred = await db.starredAmount();
  res.status(201).json(starred);
};
