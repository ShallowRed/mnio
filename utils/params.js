const rows = 5;
const cols = 5;
const vrows = 2;
const vcols = 2;

const lw = 40;
const limit = 10;
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
