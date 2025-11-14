import { create } from "./create";
import { _delete } from "./delete";
import { getById } from "./get-by-id";
import { list } from "./list";
import { run } from "./run";
import { step } from "./step";
import { update } from "./update";

export const TuringMachine = {
  create,
  delete: _delete,
  list,
  run,
  step,
  update,
  getById,
};
