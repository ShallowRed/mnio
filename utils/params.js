const rows = 50;
const cols = 50;
const vrows = 3;
const vcols = 3;

const lw = 30;
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
