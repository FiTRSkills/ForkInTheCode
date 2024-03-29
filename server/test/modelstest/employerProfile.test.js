const { connectDB, disconnectDB } = require("../util");
const EmployerProfile = require("../../src/models/employerProfile");
const Organization = require("../../src/models/organization");

describe("EmployerProfile Model Test", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  afterEach(async () => {
    await EmployerProfile.remove({});
    await Organization.remove({});
  });

  it("create profile - no organization", async () => {
    let profile = new EmployerProfile();
    await profile.save();

    let savedProfile = await EmployerProfile.findById(profile._id);
    expect(savedProfile.organization).toBeUndefined();
  });

  it("create profile - with organization", async () => {
    let organization = new Organization({ name: "Org 1" });
    await organization.save();
    let profile = new EmployerProfile({ organization: organization._id });
    await profile.save();

    let savedProfile = await EmployerProfile.findById(profile._id);
    expect(savedProfile.organization._id).toEqual(organization._id);
    expect(savedProfile.organization.name).toEqual(organization.name);
  });

  it("set organization - once", async () => {
    let profile = new EmployerProfile();
    await profile.setOrganization("Org 1");

    let savedProfile = await EmployerProfile.findById(profile._id);
    expect(savedProfile.organization.name).toEqual("Org 1");
  });

  it("set organization - twice", async () => {
    let profile = new EmployerProfile();
    await profile.setOrganization("Org 1");
    await profile.setOrganization("Org 2");

    let savedProfile = await EmployerProfile.findById(profile._id);
    expect(savedProfile.organization.name).toEqual("Org 2");
    let organizations = await Organization.find({}).exec();
    expect(organizations.length).toEqual(2);
  });

  it("set organization - existing organization", async () => {
    let organization = new Organization({ name: "Org 1" });
    await organization.save();
    let profile = new EmployerProfile();
    await profile.setOrganization("Org 1");

    let savedProfile = await EmployerProfile.findById(profile._id);
    expect(savedProfile.organization.name).toEqual("Org 1");
    let organizations = await Organization.find({}).exec();
    expect(organizations.length).toEqual(1);
  });
});
