const fs = require("fs");

class MintDb {
  constructor() {
    this.recordsDbName = "records.mint";

    this.getDb();
  }

  getDb() {
    this.db = {};
    const file = this.getFile(this.recordsDbName);
    if (file) {
      file.split("\n").forEach((record) => {
        if (record) {
          record = String(this.decode(record)).replace("\x00", "");
          const table = record.split("*:*")[0];
          this.db[table] = this.db[table] || [];
          this.db[table].push(JSON.parse(record.split("*:*")[1]));
        }
      });
      return;
    }
    this.db = [];
  }

  select(table, req = {}, idxInEachRecord = false) {
    const records = this.db[table] || [];
    console.log(req.id);
    if (req === {}) {
      return records;
    }

    const keys = Object.keys(req);
    const values = Object.values(req);
    const newRecords = [];

    records.forEach((record, recordIdx) => {
      let keep = true;
      console.log(record);
      keys.forEach((key, keyIdx) => {
        if (record[key] !== values[keyIdx].replace("GMT 0000", "GMT+0000")) {
          keep = false;
        }
      });

      if (keep) {
        const idx = {};
        if (idxInEachRecord) {
          idx.idx = recordIdx;
        }
        newRecords.push({ ...record, ...idx });
      }
    });

    return newRecords;
  }

  uuid() {
    return `${new Date()}${Math.random(1)}`;
  }

  delete(table, req) {
    const recordIds = this.select(table, req).map((record) => record.id);

    this.db[table] = this.db[table].filter(
      (record) => !recordIds.includes(record.id)
    );

    this.reWriteDb();
  }

  update(table, req, toMake) {
    const records = this.select(table, req, true);

    records.forEach((record) => {
      this.db[table][record.idx] = {
        ...record,
        ...toMake,
      };
    });

    this.reWriteDb();
  }

  reWriteDb() {
    let newDb = "";
    const values = Object.values(this.db);
    const keys = Object.keys(this.db);

    keys.forEach((key, keyIdx) => {
      const value = values[keyIdx];
      value.forEach((record) => {
        newDb += `${this.encode(`${key}*:*${JSON.stringify(record)}`)}\n`;
      });
    });
    this.writeFile(this.recordsDbName, newDb);
  }

  decode(binary) {
    // Convert the binary into an array of binary strings separated by whitespace.
    binary = binary.split(" ");
    // Convert from binary to decimals, then to characters.
    return binary
      .map((elem) => String.fromCharCode(parseInt(elem, 2)))
      .join("");
  }

  encode(string) {
    let output = "";
    string.split("").forEach((char) => {
      output += char.charCodeAt(0).toString(2) + " ";
    });
    return output;
  }

  insert(table, record) {
    record.id = this.uuid();
    this.db[table] = this.db[table] || [];
    this.db[table].push(record);
    this.appendFile(
      this.recordsDbName,
      `${this.encode(`${table}*:*${JSON.stringify(record)}`)}\n`
    );

    return record.id;
  }

  getFile(name) {
    return fs.readFileSync(`./MintDb/${name}`, "utf8");
  }

  appendFile(name, content = "") {
    fs.appendFile(`MintDb/${name}`, content, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  writeFile(name, content = "") {
    fs.writeFile(`MintDb/${name}`, content, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}

module.exports = MintDb;
