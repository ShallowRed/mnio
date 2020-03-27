const rows = 5;
const cols = 5;
const vrows = 2;
const vcols = 2;

const lw = 50;
const limit = 100;
const celltimeout = 10;

const port = 82;

module.exports = function setparams() {
  return {
    rows,
    cols,
    vrows,
    vcols,
    lw,
    limit,
    celltimeout,
    port
  }
};
