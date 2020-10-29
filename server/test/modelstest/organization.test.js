const { connectDB, disconnectDB } = require("../util");
const Organization = require("../../src/models/organization");

describe("Organization Model Test", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  afterEach(async () => {
    await Organization.remove({});
  });

  it("find or create - none exist", async () => {
    let organization = await Organization.findOneOrCreate("Org 1");
    expect(organization.name).toEqual("Org 1");
    let organizations = await Organization.find({}).exec();
    expect(organizations.length).toEqual(1);
    expect(organizations[0]._id).toEqual(organization._id);
    expect(organizations[0].name).toEqual(organization.name);
  });

  it("find or create - some exist", async () => {
    let o1 = new Organization({ name: "Org 1" });
    let o2 = new Organization({ name: "Org 2" });
    await o1.save();
    await o2.save();

    let organization = await Organization.findOneOrCreate("Org 3");
    expect(organization.name).toEqual("Org 3");
    let organizations = await Organization.find({}).exec();
    expect(organizations.length).toEqual(3);
    let savedOrganization = await Organization.findById(
      organization._id
    ).exec();
    expect(savedOrganization).toBeDefined();
  });

  it("find or create - one match exists", async () => {
    let o1 = new Organization({ name: "Org 1" });
    let o2 = new Organization({ name: "Org 2" });
    await o1.save();
    await o2.save();

    let organization = await Organization.findOneOrCreate("Org 2");
    expect(organization.name).toEqual("Org 2");
    let organizations = await Organization.find({}).exec();
    expect(organizations.length).toEqual(2);
    let savedOrganization = await Organization.findById(
      organization._id
    ).exec();
    expect(savedOrganization).toBeDefined();
  });
});
