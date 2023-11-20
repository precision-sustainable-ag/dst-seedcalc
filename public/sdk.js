/* eslint-disable */
class Options {
  static CALCULATED_PROPS = {
    plantingMethodModifier: (e, t, i) => e.plantingMethodModifier(t, i),
    seedingRate: (e, t, i) => e.seedingRate(t, i),
    seedsPerAcre: (e, t, i) => e.seedsPerAcre(t, i),
  };
  static factory(e, t = [], { crop: i, options: r }) {
    return new this(e, t, { crop: i, options: r });
  }
  constructor(e, t = [], { crop: i, options: r }) {
    (this.calculator = e),
      (this.options = r),
      (this.crop = i),
      (this.keys = t),
      (this.props = {});
    for (var s of t) {
      var a;
      r[s]
        ? ((this[s] = r[s]), (this.props[s] = r[s]))
        : Options.CALCULATED_PROPS[s] &&
          ((a = (0, Options.CALCULATED_PROPS[s])(e, i, r)),
          (this[s] = a),
          (this.props[s] = a));
    }
  }
}

class NRCS {
  constructor({ calculator: e }) {
    (this.calculator = e), (this.reasons = []);
  }
  isValidPercentInMix(e, t = {}) {
    e = this.calculator.getCrop(e);
    var i = Options.factory(this.calculator, ["percentInMix", "maxInMix"], {
        crop: e,
        options: t,
      }),
      t = i?.percentInMix ?? this.calculator.percentInMix(e, t),
      i = i?.maxInMix ?? e?.coefficients?.maxInMix;
    return (
      console.log(t, "<=", i, ":", t <= i),
      { passed: t <= i, error: "Exceeds maximum percentage of mix." }
    );
  }
  isValidPlantingDate(e, t = { plantingDate: new Date() }) {
    (e = this.calculator.getCrop(e)),
      t.plantingDate instanceof Date ||
        (t.plantingDate = new Date(t.plantingDate));
    var i,
      r = Options.factory(
        this.calculator,
        [
          "plantingDate",
          "reliableEstablishement",
          "earlySeeding",
          "lateSeeding",
        ],
        { crop: e, options: t }
      );
    let s = !1,
      a = "Planting date is not recommended.";
    for (i of [
      ...(r?.reliableEstablishement ??
        e.plantingDates?.reliableEstablishement ??
        []),
      ...(r?.earlySeeding ?? e.plantingDates?.earlySeeding ?? []),
      ...(r?.lateSeeding ?? e.plantingDates?.lateSeeding ?? []),
    ])
      if (r.plantingDate >= i.start && r.plantingDate <= i.end) {
        (s = !0), (a = null);
        break;
      }
    return { passed: s, error: a };
  }
  isValidSeedingRate(e, t = {}) {
    var i = this.calculator.seedingRate(e, {
        singleSpeciesSeedingRate: t?.singleSpeciesSeedingRate,
      }),
      t = this.calculator.seedingRate(e, t),
      r = 2.5 * i,
      i = 0.5 * i;
    return r < t
      ? {
          passed: !1,
          error:
            `(${e.label}) Failed because final seeding rate is greater than the upper limit of ` +
            r,
        }
      : t < i
      ? {
          passed: !1,
          error:
            `(${e.label}) Failed because final seeding rate is less than the lower limit of ` +
            i,
        }
      : { passed: !0 };
  }
  isValidSoilDrainage(e, t = {}) {
    if (!t?.soilDrainage) throw new Error("options.soilDrainage is required.");
    if (
      (Array.isArray(t.soilDrainage) || (t.soilDrainage = [t.soilDrainage]),
      t.soilDrainage.length <= 0)
    )
      throw new Error("options.soilDrainage must have at least 1 value.");
    e = this.calculator.getCrop(e);
    let i = !0;
    var r,
      s = [];
    for (r of t.soilDrainage)
      e.soilDrainage.includes(r) || ((i = !1), s.push(r));
    return {
      passed: i,
      error: "Invalid Soil Drainage Conditions: " + s.join(", "),
    };
  }
  runNrcsValidationHandler(e, t, i) {
    var r = this.calculator.crops;
    let s = !0;
    var a,
      n,
      o = [];
    for ([a, n] of Object.entries(r)) {
      var l = t(a, n, i),
        { passed: l, error: c } = this[e](n, l);
      l || (o.push({ crop: n.label, error: c }), (s = !1));
    }
    return { passed: s, errors: o };
  }
  mixPassesSeedingRateStandards(e = {}) {
    return this.runNrcsValidationHandler(
      "isValidSeedingRate",
      (e, t, i) => i[e] ?? {},
      e
    );
  }
  mixPassesRatioStandards(e = {}) {
    return this.runNrcsValidationHandler(
      "isValidPercentInMix",
      (e, t, i) => (i[e] ? { ...i, ...i[e] } : i),
      e
    );
  }
  mixPassesPlantingDateStandards(e = {}) {
    const r = e?.plantingDate;
    return this.runNrcsValidationHandler(
      "isValidPlantingDate",
      (e, t, i) => i[e] ?? { plantingDate: r },
      e
    );
  }
  mixPassesSoilDrainageStandards(e = {}) {
    const r = e?.soilDrainage ?? [];
    return this.runNrcsValidationHandler(
      "isValidSoilDrainage",
      (e, t, i) => i[e] ?? { soilDrainage: r },
      e
    );
  }
  mixPassesWinterSurvivalStandards(e = {}) {
    var t,
      i,
      r = this.calculator.crops,
      s = e?.threshold ?? 0.5;
    let a = 0;
    for ([t, i] of Object.entries(r)) {
      var n = e[t] ? { ...e, ...e[t] } : e,
        o = this.calculator.percentInMix(i, n),
        n = n.chanceWinterSurvival ?? i.coefficients.chanceWinterSurvival;
      a += n * o;
    }
    r = a >= s;
    return {
      passed: r,
      errors:
        !0 == r
          ? []
          : [
              {
                crop: "Mix",
                error: `The chance of winter survival is less than the minimum threshold of ${(
                  100 * s
                ).toFixed(0)}%.`,
              },
            ],
    };
  }
}

class SeedRateCalculator {
  static FACTORY_MAP = {
    mccc: () => new MWSeedRateCalculator(),
    neccc: () => new NESeedRateCalculator(),
  };
  static PROPS;
  constructor({ mix: e, council: t, userInput: i } = {}) {
    if (e)
      return SeedRateCalculator.factory({ mix: e, council: t, userInput: i });
  }
  static getFactory(e) {
    e = this.FACTORY_MAP[e];
    return e || (() => new SeedRateCalculator());
  }
  static factory({ mix: e, council: t, userInput: i }) {
    if (!t) throw new Error("council is a required parameter.");
    if (((t = t.toLowerCase()), void 0 === e))
      throw new Error("mix is a required parameter.");
    var r;
    if (
      (Array.isArray(e) || (e = [e]),
      console.log("FACTORIES", this.FACTORY_MAP),
      console.log(
        "COUNCIL",
        t,
        Object.keys(this.FACTORY_MAP).includes(t),
        this.FACTORY_MAP[t]
      ),
      Object.keys(this.FACTORY_MAP).includes(t))
    )
      return (
        ((r = this.getFactory(t)()).mix = e),
        (r.userInput = i),
        (r.council = t),
        r.init()
      );
    throw new Error("Invalid Council: " + t);
  }
  init() {
    (this.isMix = 1 < this.mix.length), (this.crops = {});
    for (var e of this.mix)
      e instanceof Crop
        ? (this.crops[e.id] = e)
        : (this.crops[e.id] = new Crop(this.council, e));
    return (
      this.sumSpeciesInMix(),
      this.setProps(),
      (this.nrcs = new NRCS({ calculator: this })),
      this
    );
  }
  getCrop(e) {
    if (!e?.id)
      throw new Error("Crop object ID could not be located. (path: crop?.id)");
    e = e.id;
    if (void 0 === this.crops[e])
      throw new Error(
        `Crop with ID: ${e} is not part of this calculators mix.`
      );
    return this.crops[e];
  }
  setProps() {
    return (
      (this.PROPS = {}),
      (this.PROPS.plantingMethodModifier = ["plantingMethod"]),
      (this.PROPS.seedingRate = [
        "singleSpeciesSeedingRate",
        "percentOfRate",
        "plantingMethodModifier",
        "managementImpactOnMix",
        "germination",
        "purity",
        ...this.PROPS.plantingMethodModifier,
      ]),
      (this.PROPS.poundsForPurchase = [
        "acres",
        "seedingRate",
        ...this.PROPS.seedingRate,
      ]),
      (this.PROPS.seedsPerAcre = [
        "seedingRate",
        "seedsPerPound",
        ...this.PROPS.seedingRate,
      ]),
      (this.PROPS.plantsPerAcre = [
        "seedsPerAcre",
        "percentSurvival",
        ...this.PROPS.seedsPerAcre,
      ]),
      (this.PROPS.plantsPerSqft = [
        "seedsPerAcre",
        "percentSurvival",
        ...this.PROPS.seedsPerAcre,
      ]),
      this.PROPS
    );
  }
  props(e) {
    this.PROPS || this.setProps();
    var t = this.PROPS;
    return e ? t[e] : t;
  }
  percentInMix(e, t = {}) {
    var i,
      r,
      e = this.getCrop(e);
    let s = 0;
    for ([i, r] of Object.entries(this.crops)) {
      var a = t[i] ?? {},
        a = ((a.seedingRate = this.seedingRate(r, a)), this.seedsPerAcre(r, a));
      s += a;
    }
    return (e.percentInMix = e.seedsPerAcre / s);
  }
  plantingMethodModifier(e, t = {}) {
    if (t?.plantingMethodModifier)
      return (e.plantingMethodModifier = t.plantingMethodModifier);
    e = this.getCrop(e);
    let i = (t = new Options(this, this.props("plantingMethodModifier"), {
      crop: e,
      options: t,
    }))?.plantingMethod;
    return !(i = i || this.userInput?.plantingMethod) ||
      ((i = i.toLowerCase().trim()),
      void 0 === e?.coefficients?.plantingMethods[i])
      ? this.getDefaultPlantingMethodModifier()
      : (e.plantingMethodModifier = e.coefficients.plantingMethods[i]);
  }
  getDefaultPlantingMethodModifier() {
    return 1;
  }
  poundsForPurchase(e, t = {}) {
    return (
      (e = this.getCrop(e)),
      (t = new Options(this, this.props("poundsForPurchase"), {
        crop: e,
        options: t,
      })).acres || (t.acres = 1),
      (e.poundsForPurchase = t.seedingRate * t.acres)
    );
  }
  plantsPerAcre(e, t = {}) {
    if (
      ((e = this.getCrop(e)),
      (t = new Options(this, this.props("plantsPerAcre"), {
        crop: e,
        options: t,
      })).percentSurvival || (t.percentSurvival = 0.85),
      1 < t.percentSurvival || t.percentSurvival < 0)
    )
      throw new Error(
        "Percent survival must be a value between 0 and 1  ( inclusive )."
      );
    return (e.plantsPerAcre = t.seedsPerAcre * t.percentSurvival);
  }
  plantsPerSqft(e, t = {}) {
    e = this.getCrop(e);
    t = this.plantsPerAcre(e, t);
    return (e.plantsPerSqft = t / 43560);
  }
  seedsPerAcre(e, t = {}) {
    if (t?.seedsPerAcre) return (e.seedsPerAcre = t.seedsPerAcre);
    if (
      ((e = this.getCrop(e)),
      (t = new Options(this, this.props("seedsPerAcre"), {
        crop: e,
        options: t,
      })).seedsPerPound || (t.seedsPerPound = e.seedsPerPound),
      !t.seedingRate)
    )
      throw new Error(
        "No Mix Seeding Rate provided, or invailid parameters to calculate mix seeding rate."
      );
    if (t.seedsPerPound)
      return (e.seedsPerAcre = t.seedsPerPound * t.seedingRate);
    throw new Error("Could not locate seeds per pound data.");
  }
  mixSeedingRate(e = {}) {
    if (e?.mixSeedingRate) return e.mixSeedingRate;
    let t = 0;
    for (var i of this.mix) {
      var r = e[i.id] ?? {};
      e.managementImpactOnMix &&
        !r.managementImpactOnMix &&
        (r.managementImpactOnMix = e.managementImpactOnMix),
        (t += this.seedingRate(i, r));
    }
    return t;
  }
  seedingRate(e, t = {}) {
    if (t?.seedingRate) return (e.seedingRate = t.seedingRate);
    e = this.getCrop(e);
    let {
        percentOfRate: i,
        singleSpeciesSeedingRate: r,
        plantingMethodModifier: s,
        germination: a,
        managementImpactOnMix: n,
        purity: o,
      } = (t = new Options(this, this.props("seedingRate"), {
        crop: e,
        options: t,
      })),
      l =
        ((i = i || this.getDefaultPercentOfSingleSpeciesSeedingRate(e, t)),
        (r = r || e.coefficients.singleSpeciesSeedingRate) * i);
    return (
      s && (l *= s),
      n && (l *= n),
      a && (l /= a),
      o && (l /= o),
      (e.seedingRate = l)
    );
  }
  getDefaultPercentOfSingleSpeciesSeedingRate(e) {
    return 1 / this.mixDiversity;
  }
  sumSpeciesInMix() {
    var e,
      t = {};
    for (e of this.mix) {
      if (!e?.group?.label)
        throw new Error(
          "Invalid Crop structure, missing crop.group.label for " + e?.label
        );
      void 0 === t[e.group.label]
        ? (t[e.group.label] = 1)
        : (t[e.group.label] += 1);
    }
    return (this.mixDiversity = Object.keys(t).length), (this.speciesInMix = t);
  }
  getCountOfGroupInMix(e) {
    return this.speciesInMix[e] ?? 0;
  }
}

class MWSeedRateCalculator extends SeedRateCalculator {
  constructor() {
    super();
  }
}

class NESeedRateCalculator extends SeedRateCalculator {
  constructor() {
    super();
  }
  setProps() {
    var e = super.setProps();
    return (
      (e.soilFertilityModifier = [
        "soilFertility",
        "soilFertilityModifier",
        "highFertilityCompetition",
        "lowFertilityCompetition",
        "highFertilityMonoculture",
        "lowFertilityMonoculture",
        "defaultSoilFertilityModifier",
        "highSoilFertilityKey",
      ]),
      (e.seedingRate = [...e.seedingRate, ...e.soilFertilityModifier]),
      this.PROPS
    );
  }
  getDefaultPercentOfSingleSpeciesSeedingRate(e, t = {}) {
    e = this.getCrop(e);
    var t = this.soilFertilityModifier(e, t),
      e = e.group,
      i = this.speciesInMix[e];
    return console.log("%Defaul params:", t, "/", i, `(${e})`), t / i;
  }
  soilFertilityModifier(e, t = {}) {
    if (t?.soilFertilityModifier) return t.soilFertilityModifier;
    e = this.getCrop(e);
    var i = this.isMix,
      r = this.isHighSoilFertility(t),
      s =
        t?.defaultSoilFertilityModifier ??
        this.getDefaultSoilFertilityModifier(e, t);
    return (
      console.log("Soil Fert params:", i, r, s, t, e),
      i
        ? r
          ? t?.highFertilityCompetition ??
            e?.coefficients?.highFertilityCompetition ??
            s
          : t?.lowFertilityCompetition ??
            e?.coefficients?.lowFertilityCompetition ??
            s
        : r
        ? t?.highFertilityMonoculture ??
          e?.coefficients?.highFertilityMonoculture ??
          s
        : t?.lowFertilityMonoculture ??
          e?.coefficients?.lowFertilityMonoculture ??
          s
    );
  }
  isHighSoilFertility(e = {}) {
    return (e?.soilFertility ?? null) === this.getHighSoilFertilityKey();
  }
  getHighSoilFertilityKey() {
    return "high";
  }
  getDefaultSoilFertilityModifier(e, t = 0) {
    return 1;
  }
}

class Crop {
  static FACTORY_MAP = {
    mccc: (e) => new MWCrop(e),
    neccc: (e) => new NECrop(e),
  };
  constructor(e, t) {
    if (e) return Crop.factory(e, t);
    this.raw = t;
  }
  static getFactory(e) {
    e = this.FACTORY_MAP[e];
    return e || (() => new Crop());
  }
  static factory(e, t) {
    if (!e) throw new Error("Council parameter must be provided.");
    if (!t?.id) throw new Error("Invalid Data Structure, Missing Property: id");
    if (!Object.keys(this.FACTORY_MAP).includes(e))
      throw new Error("Invalid Council: " + e);
    e = e.toLowerCase();
    e = this.FACTORY_MAP[e](t);
    return (
      (e.raw = t),
      (e.id = t.id),
      (e.label = t.label),
      (e.group = t?.group?.label),
      (e.calcs = {}),
      e.init()
    );
  }
  init() {
    return this;
  }
  get(...e) {
    let t = this.raw;
    for (var i of e) if (void 0 === (t = t[i])) return null;
  }
  validate({ prop: e, checks: t = [], container: i, fullPath: r }) {
    var s,
      a,
      n = e.key,
      o = n.split(".");
    let l = this.raw;
    i && (l = i);
    // console.log(e, t, i, r);
    for (s of o) {
      if ("object" != typeof l) break;
      if (Object.keys(l).includes(s)) l = l[s];
      else if (e.required)
        throw new Error(
          `(${this.label}) Invalid Crop Structure - Missing Attributes: ` +
            (r ?? n)
        );
    }
    for (a of t)
      if ("function" == typeof a.validate && !a.validate(l))
        throw new Error(
          `(${this.label}) Failed Check: ${r ?? n} - ` + a.summary
        );
    return "object" == typeof l ? {} : l;
  }
  validateProps(e, t, i) {
    if (((t = t || this.raw), Array.isArray(e)))
      for (var r of e) this.validateProps(r, t, i);
    else {
      if (
        ((i = i ? i + "." + e.key : e.key),
        this.validate({ prop: e, checks: e.checks, fullPath: i, container: t }),
        (t = t[e.key]),
        e?.props)
      )
        return this.validateProps(e.props, t, i);
      if (e.required && !(t?.values || t.values.length < 1))
        throw new Error(
          `(${this.label}) Invalid Crop Structure - Missing Values: ` +
            (i ?? path)
        );
      e?.setter &&
        1 <= t?.values?.length &&
        "function" == typeof e.setter &&
        e.setter(this, t);
    }
  }
  static interpretDateRange(e) {
    var t,
      i = [];
    for (t of e.split(" - ")) {
      var r = t.split("/");
      2 < r.length && (t = r[0] + "/" + r[1]), (t = new Date(t)), i.push(t);
    }
    return i;
  }
}

class MWCrop extends Crop {
  constructor(e) {
    super();
  }
  static props = [
    {
      key: "attributes",
      required: !0,
      props: [
        {
          key: "Coefficients",
          required: !0,
          props: [
            {
              key: "Single Species Seeding Rate",
              required: !0,
              setter: (e, t) =>
                (e.coefficients.singleSpeciesSeedingRate = Number(t.values[0])),
            },
            {
              key: "Broadcast Coefficient",
              required: !0,
              setter: (e, t) =>
                (e.coefficients.plantingMethods.broadcast = Number(
                  t.values[0]
                )),
            },
            {
              key: "Aerial Coefficient",
              required: !0,
              setter: (e, t) =>
                (e.coefficients.plantingMethods.aerial = Number(t.values[0])),
            },
            {
              key: "Precision Coefficient",
              required: !0,
              setter: (e, t) =>
                (e.coefficients.plantingMethods.precision = Number(
                  t.values[0]
                )),
            },
            {
              key: "% Live Seed to Emergence",
              required: !0,
              setter: (e, t) =>
                (e.coefficients.liveSeedToEmergence = Number(t.values[0])),
            },
            {
              key: "Max % Allowed in Mix",
              required: !0,
              setter: (e, t) => (e.coefficients.maxInMix = Number(t.values[0])),
            },
            {
              key: "% Chance of Winter Survial",
              required: !0,
              setter: (e, t) =>
                (e.coefficients.chanceWinterSurvival = Number(t.values[0])),
            },
          ],
        },
        {
          key: "Planting Information",
          required: !0,
          props: [
            {
              key: "Seed Count",
              required: !0,
              setter: (e, t) => (e.seedsPerPound = Number(t.values[0])),
            },
            {
              key: "Planting Methods",
              required: !0,
              checks: [
                {
                  validate: (e) => Array.isArray(e.values),
                  summary: "Must be an array.",
                },
              ],
              setter: (e, t) => (e.plantingMethods = t.values),
            },
          ],
        },
        {
          key: "Soil Conditions",
          required: !0,
          props: [
            {
              key: "Soil Drainage",
              required: !0,
              setter: (e, t) => (e.soilDrainage = t.values),
            },
          ],
        },
        {
          key: "NRCS",
          required: !1,
          props: [
            {
              key: "Single Species Seeding Rate",
              required: !1,
              setter: (e, t) =>
                (e.nrcs.singleSpeciesSeedingRate = Number(t.values[0])),
            },
          ],
        },
        {
          key: "Planting and Growth Windows",
          required: !1,
          props: [
            {
              key: "Reliable Establishment",
              required: !1,
              setter: (e, t) => {
                var i,
                  r = (e.plantingDates.reliableEstablishement = []);
                for (i of t.values) {
                  var [s, a] = Crop.interpretDateRange(i);
                  r.push({ start: s, end: a, range: i });
                }
              },
            },
            {
              key: "Freeze/Moisture Risk to Establishment",
              required: !1,
              setter: (e, t) => {
                var i,
                  r = (e.plantingDates.riskToEstablishment = []);
                for (i of t.values) {
                  var [s, a] = Crop.interpretDateRange(i);
                  r.push({ start: s, end: a, range: i });
                }
              },
            },
            {
              key: "Early Seeding Date",
              required: !1,
              setter: (e, t) => {
                var i,
                  r = (e.plantingDates.earlySeeding = []);
                for (i of t.values) {
                  var [s, a] = Crop.interpretDateRange(i);
                  r.push({ start: s, end: a, range: i });
                }
              },
            },
            {
              key: "Late Seeding Date",
              required: !1,
              setter: (e, t) => {
                var i,
                  r = (e.plantingDates.lateSeeding = []);
                for (i of t.values) {
                  var [s, a] = Crop.interpretDateRange(i);
                  r.push({ start: s, end: a, range: i });
                }
              },
            },
            {
              key: "Average Frost",
              required: !1,
              setter: (e, t) => {
                var i,
                  r = (e.plantingDates.averageFrost = []);
                for (i of t.values) {
                  var [s, a] = Crop.interpretDateRange(i);
                  r.push({ start: s, end: a, range: i });
                }
              },
            },
          ],
        },
      ],
    },
  ];
  init() {
    return (
      super.init(),
      (this.coefficients = { plantingMethods: {} }),
      (this.plantingDates = {}),
      (this.nrcs = {}),
      (this.custom = this?.raw?.custom ?? {}),
      this.validateProps(MWCrop.props),
      this
    );
  }
}

class NECrop extends Crop {
  constructor(e) {
    super();
  }
  static props = [
    {
      key: "attributes",
      required: !0,
      props: [
        {
          key: "Coefficients",
          required: !0,
          props: [
            {
              key: "High Fertility Competition Coefficient",
              required: !1,
              setter: (e, t) =>
                (e.coefficients.highFertilityCompetition = Number(t.values[0])),
            },
            {
              key: "Low Fertility Competition Coefficient",
              required: !1,
              setter: (e, t) =>
                (e.coefficients.lowFertilityCompetition = Number(t.values[0])),
            },
            {
              key: "High Fertility Monoculture Coefficient",
              required: !1,
              setter: (e, t) =>
                (e.coefficients.highFertilityMonoculture = Number(t.values[0])),
            },
            {
              key: "Low Fertility Monoculture Coefficient",
              required: !1,
              setter: (e, t) =>
                (e.coefficients.lowFertilityMonoculture = Number(t.values[0])),
            },
            {
              key: "Single Species Seeding Rate",
              required: !0,
              setter: (e, t) =>
                (e.coefficients.singleSpeciesSeedingRate = Number(t.values[0])),
            },
            {
              key: "Broadcast with Cultivation Coefficient",
              required: !1,
              setter: (e, t) =>
                (e.coefficients.plantingMethods.broadcast = Number(
                  t.values[0]
                )),
            },
            {
              key: "Broadcast without Cultivation Coefficient",
              required: !1,
              setter: (e, t) =>
                (e.coefficients.plantingMethods.broadcast = Number(
                  t.values[0]
                )),
            },
            {
              key: "Aerial Coefficient",
              required: !1,
              setter: (e, t) =>
                (e.coefficients.plantingMethods.aerial = Number(t.values[0])),
            },
          ],
        },
        {
          key: "Planting",
          required: !0,
          props: [
            {
              key: "Seeds Per lb",
              required: !0,
              setter: (e, t) => (e.seedsPerPound = Number(t.values[0])),
            },
            {
              key: "Planting Methods",
              required: !1,
              setter: (e, t) => (e.plantingMethods = t.values),
            },
          ],
        },
        {
          key: "Soil Conditions",
          required: !0,
          props: [
            {
              key: "Soil Drainage",
              required: !0,
              checks: [
                {
                  validate: (e) => Array.isArray(e.values),
                  summary: "Must be an array.",
                },
              ],
              setter: (e, t) => (e.soilDrainage = t.values),
            },
            {
              key: "Soil Fertility",
              required: !1,
              setter: (e, t) => (e.soilDrainage = t.values),
            },
          ],
        },
        {
          key: "Planting and Growth Windows",
          required: !1,
          props: [
            {
              key: "Reliable Establishment",
              required: !1,
              setter: (e, t) => {
                var i,
                  r = (e.plantingDates.reliableEstablishement = []);
                for (i of t.values) {
                  var [s, a] = Crop.interpretDateRange(i);
                  r.push({ start: s, end: a, range: i });
                }
              },
            },
            {
              key: "Freeze/Moisture Risk to Establishment",
              required: !1,
              setter: (e, t) => {
                var i,
                  r = (e.plantingDates.riskToEstablishment = []);
                for (i of t.values) {
                  var [s, a] = Crop.interpretDateRange(i);
                  r.push({ start: s, end: a, range: i });
                }
              },
            },
            {
              key: "Early Seeding Date",
              required: !1,
              setter: (e, t) => {
                var i,
                  r = (e.plantingDates.earlySeeding = []);
                for (i of t.values) {
                  var [s, a] = Crop.interpretDateRange(i);
                  r.push({ start: s, end: a, range: i });
                }
              },
            },
            {
              key: "Late Seeding Date",
              required: !1,
              setter: (e, t) => {
                var i,
                  r = (e.plantingDates.lateSeeding = []);
                for (i of t.values) {
                  var [s, a] = Crop.interpretDateRange(i);
                  r.push({ start: s, end: a, range: i });
                }
              },
            },
            {
              key: "Average Frost",
              required: !1,
              setter: (e, t) => {
                var i,
                  r = (e.plantingDates.averageFrost = []);
                for (i of t.values) {
                  var [s, a] = Crop.interpretDateRange(i);
                  r.push({ start: s, end: a, range: i });
                }
              },
            },
          ],
        },
      ],
    },
  ];
  init() {
    return (
      super.init(),
      (this.coefficients = { plantingMethods: {} }),
      (this.plantingDates = {}),
      (this.custom = this?.raw?.custom ?? {}),
      this.validateProps(NECrop.props),
      this
    );
  }
}
