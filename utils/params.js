const rows = 100;
const cols = 100;
const vrows = 20;
const vcols = 20;

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
