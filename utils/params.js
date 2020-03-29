const rows = 50;
const cols = 50;
const vrows = 5;
const vcols = 5;

const lw = 10;
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
