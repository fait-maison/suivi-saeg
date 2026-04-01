/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Collection "seances"
  const seances = new Collection({
    type: "base",
    name: "seances",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      {
        type: "text",
        name: "type",
        required: true,
      },
      {
        type: "number",
        name: "dur",
        required: true,
      },
      {
        type: "text",
        name: "date_sort",
        required: true,
      },
      {
        type: "text",
        name: "theme",
        required: false,
      },
    ],
  });
  app.save(seances);

  // Collection "trophees_unlocked"
  const trophees = new Collection({
    type: "base",
    name: "trophees_unlocked",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      {
        type: "text",
        name: "trophy_id",
        required: true,
      },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_trophy_id ON trophees_unlocked (trophy_id)",
    ],
  });
  app.save(trophees);
}, (app) => {
  app.delete(app.findCollectionByNameOrId("trophees_unlocked"));
  app.delete(app.findCollectionByNameOrId("seances"));
});
