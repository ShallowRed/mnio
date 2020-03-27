const rows = 50;
const cols = 50;
const vrows = 10;
const vcols = 10;

const lw = 5;
const limit = 6;
const celltimeout = 5;

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
