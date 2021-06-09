const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectEmails = async () => {
  const select = 'SELECT * FROM mail';
  const query = {
    text: select,
    values: [],
  };
  const {rows} = await pool.query(query);
  const mailboxes = [];
  const returnArray=[];
  for (const row of rows) {
    if (row.mail.received == '') {
      row.mail.toShow = '';
    } else {
      row.mail.toShow = ''+toShow(row.mail.received);
      row.mail.content = row.mail.content.substring(0, 60)+
        '...';
    }
    row.mail.id = row.id;
    row.mail.read = row.read;
    row.mail.starred = row.starred;
    const mailbox = row.mailbox;
    if (mailboxes.includes(mailbox) == false) {
      mailboxes.push(mailbox);
    }
  }
  for (let i = 0; i < mailboxes.length; i++) {
    const emails = [];
    for (const row of rows) {
      if (row.mailbox==mailboxes[i]) {
        emails.push(row.mail);
      }
    }
    returnArray.push({'name': mailboxes[i], 'mail': emails});
  }
  return (returnArray);
};

exports.selectStarredEmails = async () => {
  const select = 'SELECT * FROM mail WHERE starred = true';
  const query = {
    text: select,
    values: [],
  };
  const {rows} = await pool.query(query);
  const returnArray=[];
  for (const row of rows) {
    row.mail.toShow = ''+toShow(row.mail.received);
    row.mail.content = row.mail.content.substring(0, 60)+
      '...';
    row.mail.id = row.id;
    row.mail.read = row.read;
    row.mail.starred = row.starred;
    returnArray.push(row.mail);
  }
  return (returnArray);
};

exports.selectUserMailboxes = async () => {
  const select = 'SELECT mailbox FROM mail';
  const query = {
    text: select,
    values: [],
  };
  const {rows} = await pool.query(query);
  const mailboxes = [];
  for (const row of rows) {
    const mailbox = row.mailbox;
    if (mailboxes.includes(mailbox) == false &&
      mailbox !='sent' &&
      mailbox !='trash' &&
      mailbox !='inbox') {
      mailboxes.push(mailbox);
    }
  }
  return (mailboxes);
};
exports.selectMailboxes = async () => {
  const select = 'SELECT mailbox FROM mail';
  const query = {
    text: select,
    values: [],
  };
  const {rows} = await pool.query(query);
  const mailboxes = [];
  for (const row of rows) {
    const mailbox = row.mailbox;
    if (mailboxes.includes(mailbox) == false && mailbox!='sent') {
      mailboxes.push(mailbox);
    }
  }
  const returnMailboxes = [];
  for (let i=0; i< mailboxes.length; i++) {
    returnMailboxes.push({'name': mailboxes[i]});
  }
  return (returnMailboxes);
};

exports.selectEmail = async (id) => {
  const select = 'SELECT * FROM mail WHERE id = $1';
  const query = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query);
  if (rows[0] == undefined) {
    return rows[0];
  } else {
    rows[0].mail.id = rows[0].id;
    rows[0].mail.read = rows[0].read;
    rows[0].mail.starred = rows[0].starred;
    rows[0].mail.toShow = ''+toShow(rows[0].mail.received);
    const email = rows[0].mail;
    return email;
  }
};

exports.deleteEmail = async (id) => {
  const select = 'DELETE FROM mail WHERE id = $1';
  const query = {
    text: select,
    values: [id],
  };
  const deleted = await pool.query(query);
  return deleted;
};

exports.selectWholeEmail = async (id) => {
  const select = 'SELECT * FROM mail WHERE id = $1';
  const query = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query);
  return rows.length == 1 ? rows[0] : undefined;
};

exports.updateEmail = async (mail) => {
  const select = 'UPDATE mail SET mailbox = $1 WHERE id = $2';
  const query = {
    text: select,
    values: [mail.mailbox, mail.id],
  };
  await pool.query(query);
};

exports.markEmail = async (mail) => {
  const select = 'UPDATE mail SET read = $1 WHERE id = $2';
  const query = {
    text: select,
    values: [!mail.read, mail.id],
  };
  await pool.query(query);
};
exports.starEmail = async (mail) => {
  const select = 'UPDATE mail SET starred = $1 WHERE id = $2';
  const query = {
    text: select,
    values: [!mail.starred, mail.id],
  };
  await pool.query(query);
};

exports.insertEmail = async (mail) => {
  const id = makeUUID();
  const insert = 'INSERT INTO mail(id, mailbox, mail) VALUES ($1, $2, $3)';
  const query = {
    text: insert,
    values: [id, 'sent', mail],
  };
  await pool.query(query);
  mail.id = id;
  return mail;
};
exports.insertMailbox = async (mail, mailbox) => {
  const id = makeUUID();
  const insert = 'INSERT INTO mail(id, mailbox, mail) VALUES ($1, $2, $3)';
  const query = {
    text: insert,
    values: [id, mailbox, mail],
  };
  await pool.query(query);
  mail.id = id;
  return mail;
};
/** helper function to get the date to show
 * @param {string} received
 * @return {string} date to show
 */
function toShow(received) {
  // logic to get the right date and times
  // for loops to get each date received and
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const date = new Date(received);
  // console.log(toShow);
  const emailDate = date.getDate();
  const emailMonth = date.getMonth();
  const emailYear = date.getFullYear();
  const current = new Date();
  const currentDate = current.getDate();
  const currentMonth = current.getMonth();
  const currentYear = current.getFullYear();
  const month = months[date.getMonth()];
  let toShow = '';
  // check today
  if (currentDate == emailDate &&
    currentMonth == emailMonth && emailYear == currentYear) {
    // is it hours > 12?
    if (date.getHours() > 12) {
      toShow =
    (date.getHours() -12) +':';
    } else {
      toShow =
    date.getHours()+':';
    }
    // are the mintes less than 10?
    if (date.getMinutes() < 10) {
      toShow += '0'+ date.getMinutes();
    } else {
      toShow += date.getMinutes();
    }
    if (date.getHours() <12) {
      return (toShow+ ' AM');
    } else {
      return (toShow+ ' PM');
    }
  } else if (currentDate-1 == emailDate &&
    currentMonth == emailMonth && emailYear == currentYear) {
    return ('Yesterday');
  } else if (currentYear == emailYear) {
    return (month + ' ' + emailDate);
  } else {
    return (emailYear);
  }
}
exports.starredAmount = async () => {
  const select = 'SELECT id FROM mail WHERE starred = $1';
  const query = {
    text: select,
    values: ['true'],
  };
  const {rows} = await pool.query(query);
  if (rows[0] == undefined) {
    return 0;
  } else {
    const amount = rows.length;
    return amount;
  }
};
/** https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid/2117523#2117523
* function that makes random UUID
* @return {object} ID
*/
function makeUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
console.log(`Connected to database '${process.env.POSTGRES_DB}'`);
