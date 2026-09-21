// Formatted Seed Rate Calculator SDK
// Reconstructed from the source used by /v1/scripts/js/sdk.js.

class Options {

    static CALCULATED_PROPS = {
        plantingMethodModifier: (calculator, crop, options) => calculator.plantingMethodModifier(crop, options),
        plantingTimeCoefficient: (calculator, crop, options) => calculator.plantingTimeCoefficient(crop, options),
        seedingRate: (calculator, crop, options) => calculator.seedingRate(crop,options),
        seedsPerAcre: (calculator, crop, options) => calculator.seedsPerAcre(crop,options),
    }

    static factory(calculator, keys=[], {crop,options}){
        return new this(calculator, keys, {crop,options});
    }

    constructor(calculator, keys=[], {crop, options}) {
        this.calculator = calculator;
        this.options = {
            ...calculator.userInput,
            ...options
        };
        this.crop = crop;
        this.keys = keys;
        this.props = {};
        // next we check for calculated options that were not provided.
        for(let key of keys){

            if(options[key]) {
                this[key] = options[key];
                this.props[key] = options[key];
                continue;
            };
            
            if(Options.CALCULATED_PROPS[key]){
                const getter = Options.CALCULATED_PROPS[key];
                const val = getter(calculator, crop, options);
                this[key] = val;
                this.props[key] = val;
            }

        }
        
    }

}

/**
 * NRCS Checks Interface.
 */
class NRCS {

    constructor({calculator}){
        this.calculator = calculator;
        this.reasons = [];
    }

    /**
     * isValidPercentInMix -
     * 
     * Checks to see if this crops percent of the current mix is within the threshold of the maximum percent in mix limit.
     * 
     * @param {object} crop 
     * @param {object} options - the options for this calculation, as well as the options for calculations for specific crops in the mix.
     * @param {number} [options.percentInMix] - the percent of this crop in the current mix. 
     * @param {number} [options.maxInMix] - maximum percent in mix limit. 
     * 
     * @returns {boolean} 
     */
    isValidPercentInMix(crop, options = {}) {
        crop = this.calculator.getCrop(crop);

        const config = Options.factory(this.calculator, ['percentInMix','maxInMix'] , {crop,options});

        const percentInMix = config?.percentInMix ?? this.calculator.percentInMix(crop, options);

        const maxInMix = config?.maxInMix ?? crop?.coefficients?.maxInMix;
        
        return {
            passed: percentInMix <= maxInMix,
            error: 'Exceeds maximum percentage of mix.'
        };
    }

    /**
     * 
     * @param {object|Crop} crop 
     * @param {object} options 
     * @param {string|Date} [options.plantingDate] - defaults to now.
     * @param {Array.<{ start: Date, end: Date}>} [options.reliableEstablishement]
     * @param {Array.<{ start: Date, end: Date}>} [options.earlySeeding]
     * @param {Array.<{ start: Date, end: Date}>} [options.lateSeeding]
     */
    isValidPlantingDate(crop, options = { plantingDate: new Date(), }){
        crop = this.calculator.getCrop(crop);

        if(!(options.plantingDate instanceof Date)) options.plantingDate = new Date(options.plantingDate);

        const config = Options.factory(
            this.calculator, 
            ['plantingDate','reliableEstablishement','earlySeeding','lateSeeding'], 
            {crop,options}
        );

        const validDates = [
            ...config?.reliableEstablishement ?? crop.plantingDates?.reliableEstablishement ?? [],
            ...config?.earlySeeding ?? crop.plantingDates?.earlySeeding ?? [],
            ...config?.lateSeeding ?? crop.plantingDates?.lateSeeding ?? [],
        ];

        let passed = false;
        let error = 'Planting date is not recommended.';

        for(let range of validDates){
            if(config.plantingDate >= range.start && config.plantingDate <= range.end) {
                passed = true;
                error = null;
                break;
            }
        }

        return {passed, error};
    }
    /**
     * isValidSeedingRate - 
     * 
     * We are going to get the base mix seeding rate and the final mix seeding rate
     * then ensure that the final mix seeding rate 
     * is between 50% and 250% of the base mix seeding rate.
     *  
     * @param {object} crop - crop object 
     * @param {object} options - options object, mimics options object for mix seeding rate. ALL options provided will be used to calculate Final Mix Seeding Rate, only singleSpeciesSeedingRate & percentOfRate will be considered when calculating the Base Mix Seeding Rate.
     * @param {number} [options.singleSpeciesSeedingRate] - The single species seeding rate value for the crop. If not provided, it is set to the crop's default single species seeding rate coefficient.
     * @param {number} [options.percentOfRate] - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     * @param {number|Object} [options.plantingMethodModifier] - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     * @param {number} [options.managementImpactOnMix] - The management impact on mix value.
     * @param {number} [options.germination] - The germination value.
     * @param {number} [options.purity] - The purity value.
     */
    isValidSeedingRate(crop, options = {}){

        const baseSeedingRate = this.calculator.seedingRate(crop, {
            singleSpeciesSeedingRate: options?.singleSpeciesSeedingRate,
        });

        const finalSeedingRate = this.calculator.seedingRate(crop, options);

        // 250% of base seeding rate.
        const UPPER_LIMIT = baseSeedingRate * 2.5;
        // 50% of base seeding rate.
        const LOWER_LIMIT = baseSeedingRate * 0.5; 

        if(finalSeedingRate > UPPER_LIMIT) return {
            passed: false, 
            error: `(${crop.label}) Failed because final seeding rate is greater than the upper limit of ${UPPER_LIMIT}`
        };

        if(finalSeedingRate < LOWER_LIMIT) return {
            passed: false,
            error: `(${crop.label}) Failed because final seeding rate is less than the lower limit of ${LOWER_LIMIT}`
        };

        return { passed: true };
    }

    /**
     * isValidSoilDrainage - 
     * 
     * Checks to see if this crop contains the ALL of the soil drainage values provided. 
     * 
     * @param {object|Crop} crop - the crop object.
     * @param {object} options - the options object.
     * @param {string|array.<String>} options.soilDrainage - Either a single soil drainage value OR an array of soil drainage values.
     * 
     * @returns {boolean} True only if crop.soilDrainage contains ALL of the soil drainage values provided.
     * 
     * @throws {Error} If no soil drainages are provided this will throw an error.
     */
    isValidSoilDrainage(crop, options = {}){
        if(!options?.soilDrainage) throw new Error('options.soilDrainage is required.');

        if(!Array.isArray(options.soilDrainage)) options.soilDrainage = [options.soilDrainage];

        if(options.soilDrainage.length <= 0) throw new Error('options.soilDrainage must have at least 1 value.');


        crop = this.calculator.getCrop(crop);

        let passed = true;
        const invalidSoilDrainageClasses = [];

        for(let drainageClass of options.soilDrainage){
            if(!crop.soilDrainage.includes(drainageClass)) {
                passed = false;
                invalidSoilDrainageClasses.push(drainageClass);
            };
        }

        return {
            passed,
            error: `Invalid Soil Drainage Conditions: ${invalidSoilDrainageClasses.join(', ')}` 
        };
    }


    runNrcsValidationHandler(handler, optionsResolver, options){
        const crops = this.calculator.crops;
        let mixPassed = true;
        const errors = [];

        for(let [id, crop] of Object.entries(crops)){
            const cropOptions = optionsResolver(id, crop, options);
            const {passed, error} = this[handler](crop, cropOptions);
            if(!passed) {
                errors.push({
                    crop: crop.label,
                    error: error
                });
                mixPassed = false;
            }
        }

        return {
            passed: mixPassed,
            errors: errors
        };
    }

    /**
     * mixPassesSeedingRateStandards - 
     * 
     *  Checks to see if all crops in the mix pass the isValidSeedingRate function.
     *  If any of the crop fail that test, then the entire mix is considered to have faled the standards check.
     *  When the mix passes the standards check this function will return true, otherwise it will return false.
     * 
     * @param {object} options - options object to pass in parameters for calculations performed in this function. The options object here should contain sub-object options for each crop, where the crop.id is the key for options object.
     *  - **[crop_id]** - the crop id for a given crop should be the key value used to assign options for a given crop. mimics options object for mix seeding rate. ALL options provided will be used to calculate Final Mix Seeding Rate, only singleSpeciesSeedingRate & percentOfRate will be considered when calculating the Base Mix Seeding Rate.
     *  - - **singleSpeciesSeedingRate** -  The single species seeding rate value for the crop. If not provided, it is set to the crop's default single species seeding rate coefficient.
     *  - - **percentOfRate** - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     *  - - **plantingMethodModifier** - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     *  - - **managementImpactOnMix**  - The management impact on mix value.
     *  - - **germination**  - The germination value.
     *  - - **purity**  - The purity value.
     * 
     * @param {object} [options.crop_id]
     * @param {number} [options.crop_id.singleSpeciesSeedingRate]
     * @param {number} [options.crop_id.percentOfRate]
     * @param {number} [options.crop_id.plantingMethodModifier] 
     * @param {number} [options.crop_id.managementImpactOnMix]
     * @param {number} [options.crop_id.germination] 
     * @param {number} [options.crop_id.purity] 
     * 
     * @returns {boolean} When the mix passes the standards check this function will return true, otherwise it will return false.
     */
    mixPassesSeedingRateStandards(options = {}){

        const optionsResolver = (id, crop, options) => options[id] ?? {};

        return this.runNrcsValidationHandler('isValidSeedingRate', optionsResolver, options);
    }

    /**
     * mixPassesRatioStandards - 
     * 
     *  Checks to see if all crops in the mix passes the isValidPercentInMix function.
     *  If any of the crop fail that test, then the entire mix is considered to have faled the standards check.
     *  When the mix passes the standards check this function will return true, otherwise it will return false.
     * 
     * @param {object} options - options object to pass in parameters for calculations performed in this function. The options object here should contain sub-object options for each crop, where the crop.id is the key for options object.
     *  - **[crop_id]** - the crop id for a given crop should be the key value used to assign options for a given crop.
     *  - - **percentInMix** -  the percent of this crop in the current mix.
     *  - - **maxInMix** - maximum percent in mix limit. 
     * 
     * @param {object} [options.crop_id]
     * @param {number} [options.crop_id.percentInMix] 
     * @param {number} [options.crop_id.maxInMix]
     * 
     * @returns {boolean} When the mix passes the standards check this function will return true, otherwise it will return false.
     */
    mixPassesRatioStandards(options = {}){

        const optionsResolver = (id, crop, options) => { 
            return options[id] ? {...options, ...options[id]} : options; 
        };

        return this.runNrcsValidationHandler('isValidPercentInMix', optionsResolver, options);
    }
    
    /**
     * mixPassesPlantingDateStandards - 
     * 
     *  Checks to see if all crops in the mix passes the isValidPlantingDate function.
     *  If any of the crop fail that test, then the entire mix is considered to have faled the standards check.
     *  When the mix passes the standards check this function will return true, otherwise it will return false.
     * 
     * @param {object} options - options object to pass in parameters for calculations performed in this function. The options object here should contain sub-object options for each crop, where the crop.id is the key for options object.
     *  - **[crop_id]** - the crop id for a given crop should be the key value used to assign options for a given crop.
     *  - - **plantingDate** - defaults to now.
     *  - - **reliableEstablishement** - array of reliable establishment date range objects. 
     *  - - **earlySeeding** - array of early seeding date range objects. 
     *  - - **lateSeeding** - array of late seeding date range objects. 
     * 
     * @param {object} [options.crop_id]
     * @param {string|Date} [options.crop_id.plantingDate] 
     * @param {Array.<{ start: Date, end: Date}>} [options.crop_id.reliableEstablishement]
     * @param {Array.<{ start: Date, end: Date}>} [options.crop_id.earlySeeding]
     * @param {Array.<{ start: Date, end: Date}>} [options.crop_id.lateSeeding]
     * 
     * @returns {boolean} When the mix passes the standards check this function will return true, otherwise it will return false.
     */
    mixPassesPlantingDateStandards(options = {}){

        const plantingDate = options?.plantingDate;

        const optionsResolver = (id, crop, options) => options[id] ?? {plantingDate};

        return this.runNrcsValidationHandler('isValidPlantingDate', optionsResolver, options);
    }
    
    /**
     * mixPassesPlantingDateStandards - 
     * 
     *  Checks to see if all crops in the mix passes the isValidPlantingDate function.
     *  If any of the crop fail that test, then the entire mix is considered to have faled the standards check.
     *  When the mix passes the standards check this function will return true, otherwise it will return false.
     * 
     * @param {object} options - options object to pass in parameters for calculations performed in this function. The options object here should contain sub-object options for each crop, where the crop.id is the key for options object.
     *  - **soilDrainage** - the soil drainage values the user provided. This will be used for each crop in the mix, if soilDrainage is not given for the specific crop_id in the options object.
     *  - **[crop_id]** - the crop id for a given crop should be the key value used to assign options for a given crop.
     *  - - **soilDrainage** - the soil drainage values the user provided for this specific crop.
     * 
     * @param {string|array.<String>} [options.soilDrainage]
     * @param {object} [options.crop_id]
     * @param {string|array.<String>} [options.crop_id.soilDrainage] 
     * 
     * @returns {boolean} When the mix passes the standards check this function will return true, otherwise it will return false.
     * 
     * @throws {Error} When options.crop_id.soilDrainage or options.soilDrainage is not provided.
     */
    mixPassesSoilDrainageStandards(options = {}){

        const soilDrainage = options?.soilDrainage ?? [];

        const optionsResolver = (id, crop, options) => options[id] ?? {soilDrainage};

        return this.runNrcsValidationHandler('isValidSoilDrainage', optionsResolver, options);
    }

    /**
     * mixPassesPlantingDateStandards - 
     * 
     *  Checks to see if all crops in the mix passes the isValidPlantingDate function.
     *  If any of the crop fail that test, then the entire mix is considered to have faled the standards check.
     *  When the mix passes the standards check this function will return true, otherwise it will return false.
     * 
     * @param {object} options - options object to pass in parameters for calculations performed in this function. The options object here should contain sub-object options for each crop, where the crop.id is the key for options object.
     *  - **soilDrainage** - the soil drainage values the user provided. This will be used for each crop in the mix, if soilDrainage is not given for the specific crop_id in the options object.
     *  - **[crop_id]** - the crop id for a given crop should be the key value used to assign options for a given crop.
     *  - - **soilDrainage** - the soil drainage values the user provided for this specific crop.
     * 
     * @param {string|array.<String>} [options.soilDrainage]
     * @param {object} [options.crop_id]
     * @param {string|array.<String>} [options.crop_id.soilDrainage] 
     * 
     * @returns {boolean} When the mix passes the standards check this function will return true, otherwise it will return false.
     * 
     * @throws {Error} When options.crop_id.soilDrainage or options.soilDrainage is not provided.
     */
    mixPassesWinterSurvivalStandards(options = { }){
        const crops = this.calculator.crops;
        const threshold = options?.threshold ?? 0.5;
        let chanceOfMixSurvival = 0.00;

        for(let [id, crop] of Object.entries(crops)){

            const cropOptions =  options[id] ? {...options,...options[id]} : options; 

            const percentInMix = this.calculator.percentInMix(crop, cropOptions);
            const winterSurvivability = cropOptions.chanceWinterSurvival ?? crop.coefficients.chanceWinterSurvival;
            const chanceOfCropSurvivalInMix = winterSurvivability * percentInMix;
            chanceOfMixSurvival += chanceOfCropSurvivalInMix;

        }

        const passed = chanceOfMixSurvival >= threshold;
        const errors = passed === true ? [] : [{crop: 'Mix', error: `The chance of winter survival is less than the minimum threshold of ${(threshold * 100).toFixed(0)}%.`}];

        return { passed, errors };
    }

}


/**
 * CALCULATOR INTERFACE
 */
class SeedRateCalculator {

    static FACTORY_MAP = {
        'mccc': () => new MWSeedRateCalculator(),
        'neccc': () => new NESeedRateCalculator(),
        'sccc': () => new SOSeedRateCalculator(),
    }

    static PROPS;

    constructor({mix, council, regions, userInput} = {}){
        if(!userInput) userInput = {};
        if(mix){
            return SeedRateCalculator.factory({mix, council, regions, userInput});
        }
    }

    static getFactory(K){
        let factory = this.FACTORY_MAP[K];

        if(factory) return factory;

        return () => {
            return new SeedRateCalculator();
        }
    }

    /**
     * Factory method to create instances of the class based on the council.
     *
     * @param {Object} options - The options object.
     * @param {Array|string} options.mix - The mix or mixes for the instance.
     * @param {string} options.council - The council for which to create the instance.
     * @param {Object} [options.userInput] - The optional user input for the instance.
     * 
     * @returns {Object} The created instance.
     * 
     * @throws {Error} If council or mix is not provided or council is invalid.
     */
    static factory({mix, council, regions, userInput}){
        if(!council) throw new Error('council is a required parameter.');
        council = council.toLowerCase();

        if(typeof mix === 'undefined') throw new Error('mix is a required parameter.');

        if(!Array.isArray(mix)) mix = [mix];
        
        if(!Object.keys(this.FACTORY_MAP).includes(council)){
            throw new Error(`Invalid Council: ${council}`);
        }
        
        const builder = this.getFactory(council);

        const instance = builder();

        instance.mix = mix;
        instance.userInput = userInput;
        instance.council = council;
        instance.regions = regions;

        return instance.init();
    }

    /**
     * Initalize the Calculator.
     * 
     * @returns {this}
     */
    init(){
        this.isMix = this.mix.length > 1;
        this.crops = {}
        for(let crop of this.mix){
            if(!(crop instanceof Crop)) this.crops[crop.id] = new Crop(this.council, crop);
            else this.crops[crop.id] = crop;
        }
        this.sumSpeciesInMix();
        this.setProps();
        return this;
    }

    /**
     * Get Crop Instance
     */
    getCrop(obj){
        // if(obj instanceof Crop) return obj;

        if(!obj?.id) throw new Error('Crop object ID could not be located. (path: crop?.id)');

        const id = obj.id;

        if(typeof this.crops[id] === 'undefined') throw new Error(`Crop with ID: ${id} is not part of this calculators mix.`);

        return this.crops[id];
    }

    setProps(){

        this.PROPS = {};
        this.PROPS.plantingMethodModifier = ['plantingMethod'];
        this.PROPS.plantingTimeCoefficient = ['plantingDate'];

        this.PROPS.seedingRate = [
            'singleSpeciesSeedingRate', 
            'percentOfRate', 
            'plantingMethodModifier', 
            'plantingTimeCoefficient', 
            'managementImpactOnMix', 
            'germination', 
            'purity',
            ...this.PROPS.plantingMethodModifier
        ];
        
        this.PROPS.poundsForPurchase = ['acres', 'seedingRate', ...this.PROPS.seedingRate];
        this.PROPS.seedsPerAcre = ['seedingRate','seedsPerPound', ...this.PROPS.seedingRate];
        this.PROPS.plantsPerAcre = ['seedsPerAcre','percentSurvival', ...this.PROPS.seedsPerAcre];
        this.PROPS.plantsPerSqft = ['seedsPerAcre','percentSurvival', ...this.PROPS.seedsPerAcre];

        return this.PROPS;
    }

    /**
     * Props interface
     * 
     * The Props interface maps option keys to function names, 
     * this is used to denote which object keys that should be made available when constructing the options object.
     * options objects are constructed for most functions on this class, and the options object
     * primarily enables us to set defaults, and perform calculations when a specific options default is the result of a calculation.
     * please see the Options class for more information & implementations.
     */
    props(P){
        if(!this.PROPS) this.setProps();

        const props = this.PROPS;

        if(P){
            return props[P];
        }

        return props;
    }

    /**
     * Percent In Mix - 
     * 
     * Calculates a specific crops percent of seeds in the current mix. 
     * 
     * @param {object} crop 
     * @param {object} options - the options for this calculation, as well as the options for calculations for specific crops in the mix.
     * @param {number} options.sumSeedsPerAcre - sum of all seeds in the mix. if this option is not given, it will be calculated using other config options provided, or default values. 
     * @param {object} [options.crop_id] [{cropId}] - options for a specific cropId that will be used for calculations (mix seeding rate, seeds per acre) needed for the specified crop in the mix.
     * @param {number} [options.seedingRate] [{cropId}].seedingRate - overrides and sets the seedingRate for the given cropId in this mix. 
     * @param {number} [options.seedsPerAcre] [{cropId}].seedsPerAcre - overrides and sets the seedsPerAcre for the given cropId in this mix. 
     * 
     * @returns {number} The percent of seed for the given crop in the current mix.
     * 
     */
    percentInMix(crop, options={}){
 
        const ORIGINAL_CROP = this.getCrop(crop);

        let sumSeedsPerAcre = 0;
        for(let [id, crop] of Object.entries(this.crops)){
            const cropOptions = options[id] ?? {};

            cropOptions.seedingRate = this.seedingRate(crop, cropOptions);

            const seedsPerAcre = this.seedsPerAcre(crop, cropOptions);

            sumSeedsPerAcre += seedsPerAcre;
        }

        return ORIGINAL_CROP.percentInMix = (ORIGINAL_CROP.seedsPerAcre / sumSeedsPerAcre);
    }

    /**
     * Planting Method Modifier -
     * Calculates the planting method modifier for a given crop and planting method.
     *
     * @param {Object} crop - The crop object to calculate the planting method modifier for. MUST be part of the mix used to instantiate the calculator instance.
     * @param {Object} options - The options object.
     * @param {string} options.plantingMethod - The planting method to calculate the modifier for.
     * 
     * @returns {number} The planting method modifier for the given crop and planting method.
     */
    plantingMethodModifier(crop, options={}){
        if(options?.plantingMethodModifier) return crop.plantingMethodModifier = options.plantingMethodModifier;

        crop = this.getCrop(crop);

        options = new Options(this, this.props('plantingMethodModifier'), {crop,options})

        let plantingMethod = options?.plantingMethod;

        if(!plantingMethod) plantingMethod = this.userInput?.plantingMethod;

        let plantingMethodKey = this.getPlantingMethodKey(plantingMethod);

        if(typeof crop?.coefficients?.plantingMethods[plantingMethodKey] === 'undefined'){
            return this.getDefaultPlantingMethodModifier();
        }
        
        return crop.plantingMethodModifier = crop.coefficients.plantingMethods[plantingMethod];
    }

    getPlantingMethodKey(plantingMethodString){
        if(!plantingMethodString || !(typeof plantingMethodString === 'string')) return false;

        const map = {
            "drilled": 'drilled',
            "aerial": 'aerial',
            "broadcast(with cultivation)": 'broadcastWithCultivation',
            "broadcast(without cultivation)": 'broadcastWithoutCultivation',
            "broadcast(with cultivation, no packing)": 'broadcastWithCultivationNoPacking',
        }

        plantingMethodString = plantingMethodString.toLowerCase().trim();

        return map[plantingMethodString]
    }

    /**
     * 
     * Gets the default planting method modifier.
     * * Generally this defaults to 1, meaning the seeding rate will be unchanged.
     * 
     * @returns {number} - defualt planting method modifier.
     */
    getDefaultPlantingMethodModifier(){
        return 1;
    }

    /**
     * Pounds for purchase
     * 
     * @param {Object} crop - The crop object.
     * @param {Object} options - The options object.
     * @param {number} [options.acres] - The number of acres used to calculate the total number of pounds for purchase.
     * @param {number} [options.seedingRate] - The mix seeding rate to use for calculations. This will override the need to perform the mix seeding rate calculation inline.
     * @param {number} [options.singleSpeciesSeedingRate] - The single species seeding rate value for the crop. If not provided, it is set to the crop's single species seeding rate coefficient.
     * @param {number} [options.percentOfRate] - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     * @param {number} [options.plantingMethodModifier] - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     * @param {number} [options.managementImpactOnMix] - The management impact on mix value.
     * @param {number} [options.germination] - The germination value.
     * @param {number} [options.purity] - The purity value.
     * 
     * @throws {Error} When management impact on mix, germination or purity values are not within the allowed range.
     * 
     * @returns {number} The mix seeding rate value.
     */
    poundsForPurchase(crop, options={}){
        crop = this.getCrop(crop);

        options = new Options(this, this.props('poundsForPurchase'), {crop,options})

        if(!options.acres) options.acres = 1;

        return crop.poundsForPurchase = options.seedingRate * options.acres;
    }

    /**
     * Plants Per Acre -
     * Calculates the plants per acre for a given crop
     * 
     * @param {Crop} crop - The name of the crop
     * @param {Object} [options={}] - An optional object containing configuration parameters
     * @param {number} [options.percentSurvival=0.85] - The percentage of seeds that survive and grow
     * @param {number} [options.seedsPerAcre] - The number of seeds per acre of the crop
     * @param {number} [options.seedsPerPound] - The number of seeds per pound of the crop
     * @param {number} [options.seedingRate] - The mix seeding rate to use for calculations. This will override the need to perform the mix seeding rate calculation inline.
     * @param {number} [options.singleSpeciesSeedingRate] - The single species seeding rate value for the crop. If not provided, it is set to the crop's single species seeding rate coefficient.
     * @param {number} [options.percentOfRate] - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     * @param {number} [options.plantingMethodModifier] - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     * @param {number} [options.managementImpactOnMix] - The management impact on mix value.
     * @param {number} [options.germination] - The germination value.
     * @param {number} [options.purity] - The purity value.
     * 
     * 
     * @throws {Error} If percent survival is not a value between 0 and 1 (inclusive)
     * 
     * @returns {number} The plants per acre for the given crop
     */
    plantsPerAcre(crop, options={}){
        crop = this.getCrop(crop);

        options = new Options(this, this.props('plantsPerAcre'), {crop, options})

        if(!options.percentSurvival){
            options.percentSurvival = 0.85;
        }
        if(options.percentSurvival > 1 || options.percentSurvival < 0){
            throw new Error('Percent survival must be a value between 0 and 1  ( inclusive ).');
        }
        
        return crop.plantsPerAcre = options.seedsPerAcre * options.percentSurvival;
    }

    /**
     * Plant Per SqFt -
     * Calculates the plants per square foot for a given crop
     * 
     * @param {Crop} crop - The name of the crop
     * @param {Object} [options={}] - An optional object containing configuration parameters
     * @param {number} [options.percentSurvival=0.85] - The percentage of seeds that survive and grow
     * @param {number} [options.seedsPerAcre] - The number of seeds per acre of the crop
     * @param {number} [options.seedsPerPound] - The number of seeds per pound of the crop
     * @param {number} [options.seedingRate] - The mix seeding rate to use for calculations. This will override the need to perform the mix seeding rate calculation inline.
     * @param {number} [options.percentOfRate] - The percentage of the mix seeding rate to use
     * @param {number} [options.singleSpeciesSeedingRate] - The single species seeding rate value for the crop. If not provided, it is set to the crop's single species seeding rate coefficient.
     * @param {number} [options.percentOfRate] - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     * @param {number} [options.plantingMethodModifier] - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     * @param {number} [options.managementImpactOnMix] - The management impact on mix value.
     * @param {number} [options.germination] - The germination value.
     * @param {number} [options.purity] - The purity value.
     * 
     * 
     * @throws {Error} If percent survival is not a value between 0 and 1 (inclusive)
     * 
     * @returns {number} The plants per acre for the given crop
     */    
    plantsPerSqft(crop, options={}){
        crop = this.getCrop(crop);
        const plantPerAcre = this.plantsPerAcre(crop, options);
        const ACRES_PER_SQFT = 43560;

        return crop.plantsPerSqft = plantPerAcre / ACRES_PER_SQFT;
    }

    /**
     * Seeds Per Acre -
     * Calculates the seeds per acre for a given crop
     * 
     * @param {Crop} crop - The name of the crop
     * @param {Object} [options] - An optional object containing configuration parameters
     * @param {number} [options.seedsPerPound] - The number of seeds per pound of the crop
     * @param {number} [options.mixSeedingRate] - The mix seeding rate to use for calculations. This will override the need to perform the mix seeding rate calculation inline.
     * @param {number} [options.singleSpeciesSeedingRate] - The single species seeding rate value for the crop. If not provided, it is set to the crop's single species seeding rate coefficient.
     * @param {number} [options.percentOfRate] - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     * @param {number|Object} [options.plantingMethodModifier] - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     * @param {number} [options.managementImpactOnMix] - The management impact on mix value.
     * @param {number} [options.germination] - The germination value.
     * @param {number} [options.purity] - The purity value.
     * 
     * 
     * @throws {Error} If no mix seeding rate is provided or invalid parameters to calculate mix seeding rate
     * @throws {Error} If seeds per pound data could not be located
     * 
     * @returns {number} The seeds per acre for the given crop
     */
    seedsPerAcre(crop, options={}) {
        if(options?.seedsPerAcre) return crop.seedsPerAcre = options.seedsPerAcre;

        crop = this.getCrop(crop);
        options = new Options(this, this.props('seedsPerAcre'), {crop, options})

        if(!options.seedsPerPound) {
            options.seedsPerPound = crop.seedsPerPound;
        }
        
        if(!options.seedingRate) throw new Error('No Mix Seeding Rate provided, or invailid parameters to calculate mix seeding rate.');
        if(!options.seedsPerPound) throw new Error('Could not locate seeds per pound data.');

        return crop.seedsPerAcre = options.seedsPerPound * options.seedingRate;
    }


    /**
     * Mix Seeding Rate - 
     * 
     * Calculates the overall seeding rate of the mix. 
     * This is calculated by calculating the average of all seeding rates for the crops in the mix.
     * 
     * 
     * @param {object} options - options object to pass in parameters for calculations performed in this function. The options object here should contain sub-object options for each crop, where the crop.id is the key for options object.
     *  - **managementImpactOnMix** - the management impact on mix (percentage value) 
     *  - **[crop_id]** - the crop id for a given crop should be the key value used to assign options for a given crop. mimics options object for mix seeding rate. ALL options provided will be used to calculate Final Mix Seeding Rate, only singleSpeciesSeedingRate & percentOfRate will be considered when calculating the Base Mix Seeding Rate.
     *  - - **managementImpactOnMix** - the management impact on mix (percentage value) 
     *  - - **singleSpeciesSeedingRate** -  The single species seeding rate value for the crop. If not provided, it is set to the crop's default single species seeding rate coefficient.
     *  - - **percentOfRate** - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     *  - - **plantingMethodModifier** - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     *  - - **managementImpactOnMix**  - The management impact on mix value.
     *  - - **germination**  - The germination value.
     *  - - **purity**  - The purity value.
     * 
     * @param {number} [options.mixSeedingRate]
     * @param {number} [options.managementImpactOnMix]
     * @param {object} [options.crop_id]
     * @param {number} [options.crop_id.managementImpactOnMix]
     * @param {number} [options.crop_id.seedingRate]
     * @param {number} [options.crop_id.singleSpeciesSeedingRate]
     * @param {number} [options.crop_id.percentOfRate]
     * @param {number} [options.crop_id.plantingMethodModifier] 
     * @param {number} [options.crop_id.germination] 
     * @param {number} [options.crop_id.purity] 
     */
    mixSeedingRate(options={}){
        if(options?.mixSeedingRate) return options.mixSeedingRate;

        let sum = 0;

        for(let crop of this.mix){
            const opts = options[crop.id] ?? {}
            if(options.managementImpactOnMix && !opts.managementImpactOnMix) opts.managementImpactOnMix = options.managementImpactOnMix;

            sum += this.seedingRate(crop, opts);
        }

        return sum;
    }

    /**
     * Seeding Rate -
     * 
     * Calculates the Seeding Rate for the given crop, with the options provided.
     * 
     * @param {Object} crop - The crop object.
     * @param {number} crop.coefficients.singleSpeciesSeedingRate - The single species seeding rate coefficient for the crop.
     * @param {Object} options - The options object.
     *  - **managementImpactOnMix** - the management impact on mix (percentage value) 
     *  - **singleSpeciesSeedingRate** -  The single species seeding rate value for the crop. If not provided, it is set to the crop's default single species seeding rate coefficient.
     *  - **percentOfRate** - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     *  - **plantingMethodModifier** - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     *  - **managementImpactOnMix**  - The management impact on mix value.
     *  - **germination**  - The germination value.
     *  - **purity**  - The purity value.
     * 
     * @param {number} [options.singleSpeciesSeedingRate] - The single species seeding rate value for the crop. If not provided, it is set to the crop's single species seeding rate coefficient.
     * @param {number} [options.percentOfRate] - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     * @param {number} [options.plantingMethodModifier] - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     * @param {number} [options.managementImpactOnMix] - The management impact on mix value.
     * @param {number} [options.germination] - The germination value.
     * @param {number} [options.purity] - The purity value.
     * 
     * @returns {number} The seeding rate for the given crop and options.
     */
    seedingRate(crop, options = {}){
        if(options?.seedingRate) return crop.seedingRate = options.seedingRate;
        crop = this.getCrop(crop);

        options = new Options(this, this.props('seedingRate'), {crop, options})
        
        let {
            percentOfRate, 
            singleSpeciesSeedingRate, 
            plantingMethodModifier, 
            plantingTimeCoefficient,
            germination, 
            managementImpactOnMix,
            purity,
            mixCompetitionCoefficient
        } = options;

        if(!mixCompetitionCoefficient){
            mixCompetitionCoefficient = this.getDefaultMixCompetitionCoefficient(crop,options);
        }

        if(!percentOfRate){
            percentOfRate = this.getDefaultPercentOfSingleSpeciesSeedingRate(crop, options);
        }

        if(!plantingTimeCoefficient){
            plantingTimeCoefficient = this.getDefaultPlantingTimeCoefficient(crop,options);
        }
        
        if(!singleSpeciesSeedingRate){
            singleSpeciesSeedingRate = crop.coefficients.singleSpeciesSeedingRate
        }
        
        let seedingRate = singleSpeciesSeedingRate * percentOfRate;

        if(plantingMethodModifier){
            seedingRate = seedingRate * plantingMethodModifier;
        }

        if(plantingTimeCoefficient){
            seedingRate = seedingRate * plantingTimeCoefficient;
        }

        if(mixCompetitionCoefficient){
            seedingRate = seedingRate * mixCompetitionCoefficient;
        }

        if(managementImpactOnMix){
            seedingRate = seedingRate * managementImpactOnMix;
        }

        if(germination){
            seedingRate = seedingRate / germination;
        }

        if(purity){
            seedingRate = seedingRate / purity;
        }

        console.log('calc params:',{percentOfRate, 
            singleSpeciesSeedingRate, 
            plantingMethodModifier, 
            plantingTimeCoefficient,
            germination, 
            managementImpactOnMix,
            purity,
            mixCompetitionCoefficient});

        return crop.seedingRate = seedingRate;
    }

    /**
     * Gets the default percent of single species seeding rate. 
     * This means that only a certain percantage of single species seeding rate will be applied for the given mix. 
     * 
     * In general this will always be 1 for non-mixes, and the default value for mixes is 1/mixDiversity
     * 
     * @returns {number} Default Percent of Single Species Seeding Rate
     */
    getDefaultPercentOfSingleSpeciesSeedingRate(crop){
        return 1/this.mixDiversity;
    }

    plantingTimeCoefficient(crop, options){
        return this.getDefaultPlantingTimeCoefficient();
    }

    getDefaultPlantingTimeCoefficient(){
        return 1;
    }

    getDefaultMixCompetitionCoefficient(){
        return 1;
    }

    /**
     * Generally this is an operation function that triggers when a mix is created or edited.
     * * If you simply need the `speciesInMix` object, you can access it through the public property `speciesInMix`.
     * 
     * * If you want to get the count of a specific group based on the group name, you can call the public function 
     * `getCountOfGroupInMix(G)` where `G` is the group label.
     * 
     * @returns {object} returns an object containing crop groups as the key, and the count of that group for the given mix. 
     */
    sumSpeciesInMix(){
        const mix = this.mix;
        const counts = {};
        for(let crop of mix){
            if(!crop?.group?.label) throw new Error(`Invalid Crop structure, missing crop.group.label for ${crop?.label}`);
            if(typeof counts[crop.group.label] === 'undefined') counts[crop.group.label] = 1;
            else counts[crop.group.label] += 1;
        }
        this.mixDiversity = Object.keys(counts).length;
        return this.speciesInMix = counts;
    }

    /**
     * Gets the count of a specific group based on the group name, 
     * 
     * @param {string} G - label of group to get count for. 
     * 
     * @returns {number} - defaults to 0 if the group is not in the mix.
     */
    getCountOfGroupInMix(G){
        return this.speciesInMix[G] ?? 0;
    }


}


/**
 * MID WEST CALCULATOR
 */

class MWSeedRateCalculator extends SeedRateCalculator {

    constructor(){
        super();
    }

    /**
     * Initalize the Calculator.
     * 
     * @returns {this}
     */
    init(){
        super.init()
        this.nrcs = new NRCS({calculator: this});
        return this;
    }

}
/**
 * NORTH EAST CALCULATOR
 */

class NESeedRateCalculator extends SeedRateCalculator {

    constructor(){
        super();
    }

    setProps(){
        const props = super.setProps();

        props.soilFertilityModifier = [
            'soilFertility',
            'soilFertilityModifier',
            'highFertilityCompetition',
            'lowFertilityCompetition',
            'highFertilityMonoculture',
            'lowFertilityMonoculture',
            'defaultSoilFertilityModifier',
            'highSoilFertilityKey',
        ];

        props.seedingRate = [ ...props.seedingRate, ...props.soilFertilityModifier];

        return this.PROPS;
    }


    /**
     * Gets the default percent of single species seeding rate. 
     * This means that only a certain percantage of single species seeding rate will be applied for the given mix. 
     * 
     * In general this will always be 1 for non-mixes.
     * 
     * For NE this equation is as follows:
     *      %S3R    - percent single species seeding rate
     *      FsR     - final seeding rate
     *      BsR     - base seeding rate
     *      MRm     - Mix Ratio Modifier
     *      SFm     - Soil Fertility modifier
     *      PMm     - Planting method modifier
     *      Scct    - Sum Cover Crop Type ( count of that group in mix )
     * 
     * ALGEBRAIC FORMULA REDUCTION:
     *  %S3R    = FsR / (BsR * PMm)
     *  FsR     = BsR * MRm
     *  MRm     = SFm * PMm / SccT
     *  FsR     = BsR * (SFm * PMm / SccT)
     *  %S3R    = (BsR * (SFm * PMm / SccT)) / (BsR * PMm)
     *  %S3R    = (BsR * SFm * PMm) / (BsR * PMm * SccT)
     *  %S3R    = SFm / SccT
     *  
     * FINAL FORMULA:
     *  %S3R = SoilFertilityModifer / SumGroupInMix
     * 
     * @returns {number} Default Percent of Single Species Seeding Rate
     */
    getDefaultPercentOfSingleSpeciesSeedingRate(crop, options = {}){
        crop = this.getCrop(crop);
        const soilFertilityModifer = this.soilFertilityModifier(crop, options);
        const group = crop.group;
        const sumGroupInMix = this.speciesInMix[group];
        return soilFertilityModifer/sumGroupInMix;
    }

    /**
     * Soil Fertility Modifier -
     * 
     * aquires the soil fertility modifier based on the soilFertility (generally user inpur),
     * and the crop object provided. Options can be provided to override standard acquisition.
     * 
     * @param {object} crop - the crop object.
     * @param {object} options - the options object.
     *  - **soilFertility** - the soil fertility of the physical field where the crops will be planted
     *  - **highFertilityCompetition** - the high fertility competition coefficient to be returned
     *  - **lowFertilityCompetition** - the low fertility competition coefficient to be returned
     *  - **highFertilityMonoculture** - the high fertility monoculture coefficient to be returned
     *  - **lowFertilityMonoculture** - the high fertility monoculture coefficient to be returned
     *  - **defaultSoilFertilityModifier** - the default coefficient to be returned
     *  - **highSoilFertilityKey** - the key for high soil fertility. This is what is used to evaluate against the soilFertility provided by user input
     * to determine if the fields soil is high fertility or not.
     * 
     * @param {string} [options.soilFertility] - the soil fertility of the physical field where the crops will be planted
     * @param {string} [options.soilFertilityModifier] - the soil fertility of the physical field where the crops will be planted
     * @param {string} [options.highFertilityCompetition] - the high fertility competition coefficient to be returned
     * @param {string} [options.lowFertilityCompetition] - the low fertility competition coefficient to be returned
     * @param {string} [options.highFertilityMonoculture] - the high fertility monoculture coefficient to be returned
     * @param {string} [options.lowFertilityMonoculture] - the high fertility monoculture coefficient to be returned
     * @param {string} [options.defaultSoilFertilityModifier] - the default coefficient to be returned
     * @param {string} [options.highSoilFertilityKey] - the key for high soil fertility. This is what is used to evaluate against the soilFertility provided by user input
     * to determine if the fields soil is high fertility or not.
     * 
     */
    soilFertilityModifier(crop, options = {}){

        if(options?.soilFertilityModifier) return options.soilFertilityModifier;

        crop = this.getCrop(crop);
        const isMix = this.isMix;
        const isHighSoilFertility = this.isHighSoilFertility(options);
        const defaultModifier = options?.defaultSoilFertilityModifier ?? this.getDefaultSoilFertilityModifier(crop,options);
        if(isMix){
            if(isHighSoilFertility){
                return options?.highFertilityCompetition ?? crop?.coefficients?.highFertilityCompetition ?? defaultModifier;
            }
            return options?.lowFertilityCompetition ?? crop?.coefficients?.lowFertilityCompetition ?? defaultModifier
        }
        
        if(isHighSoilFertility){
            return options?.highFertilityMonoculture ?? crop?.coefficients?.highFertilityMonoculture ?? defaultModifier;
        }

        return options?.lowFertilityMonoculture ?? crop?.coefficients?.lowFertilityMonoculture ?? defaultModifier
    }

    /**
     * performs an evaluation of the options provided to 
     * determine if the fields soil fertility is high.
     * DEFAULTS TO FALSE. 
     * 
     * @param {object} options  - the options object.
     *  - **highSoilFertilityKey** - the key for high soil fertility. This is what is used to evaluate against the soilFertility provided by user input
     * to determine if the fields soil is high fertility or not.
     * 
     * @param {string} [options.highSoilFertilityKey] - the key for high soil fertility. This is what is used to evaluate against the soilFertility provided by user input
     * to determine if the fields soil is high fertility or not.
     * 
     * @returns {boolean} true if options.soilFertility matches string provided by getHighSoilFertilityKey, otherwise false.
     */
    isHighSoilFertility(options={}){
        const soilFertility = options?.soilFertility ?? null;

        return soilFertility === this.getHighSoilFertilityKey();
    }

    /**
     * @returns {string} the key for high soil fertility. This is what is used to evaluate against the soilFertility provided by user input
     * to determine if the fields soil is high fertility or not.
     */
    getHighSoilFertilityKey(){
        return 'high';
    }

    /**
     * @param {*} crop 
     * @param {*} options 
     * @returns {number} the default soil fertility modifier.
     */
    getDefaultSoilFertilityModifier(crop, options={}){
        return 1;
    }

}


/**
 * SCCC Calculator
 * 
 * 
 */
class SOSeedRateCalculator extends SeedRateCalculator {

    getFreezingZones(){
        return [
            'Zone 6',
            'Zone 7',
            'Zone 8',
        ]
    }

    isFreezingZone(){
        const freezingZones = new Set(this.getFreezingZones());
        return freezingZones.has(this.zone.label);
    }
    
    /**
     * Initalize the Calculator.
     * 
     * @returns {this}
     */
    init(){
        super.init()
        this.nrcs = new NRCS({calculator: this});
        this.zone = this.regions[0];
        if(!this.zone) throw new Error('Could not identify Plant Hardiness Zone.');

        return this;
    }

    setProps(){
        const props = super.setProps();

        props.plantingTimeCoefficient = [
            'plantingDate',
        ];

        props.seedingRate = [ ...props.seedingRate, ...props.plantingTimeCoefficient, 'mixCompetitionCoefficient'];

        return this.PROPS;
    }

    
    plantingTimeCoefficient(crop, options={}){
        if(options?.plantingTimeCoefficient) return options.plantingTimeCoefficient;

        options = new Options(this, this.props('plantingTimeCoefficient'), {crop, options})
        
        crop = this.getCrop(crop);

        let {
            plantingDate,
        } = options;

        if(!plantingDate) return this.getDefaultPlantingTimeCoefficient();

        plantingDate = new Date(plantingDate);

        let earlyFallPlantingWindows = crop.plantingDates.earlyFallSeeding;
        let lateFallPlantingWindows = crop.plantingDates.lateFallSeeding;

        if(earlyFallPlantingWindows && earlyFallPlantingWindows.length > 0) {
            for(let window of earlyFallPlantingWindows){

                if(plantingDate >= window.start && plantingDate <= window.end) {
                    if(crop.coefficients.planting.earlyFall) return crop.coefficients.planting.earlyFall;
                    
                    return this.getDefaultPlantingTimeCoefficient();
                }
            }
        }

        if(lateFallPlantingWindows && lateFallPlantingWindows.length > 0) {
            for(let window of lateFallPlantingWindows){

                if(plantingDate >= window.start && plantingDate <= window.end) {
                    if(crop.coefficients.planting.lateFall) return crop.coefficients.planting.lateFall;

                    return this.getDefaultPlantingTimeCoefficient();
                }
            }
        }

        return this.getDefaultPlantingTimeCoefficient();
    }

    getDefaultPlantingTimeCoefficient(){
        return 1;
    }

    getDefaultMixCompetitionCoefficient(crop,options={}){
        if(options?.mixCompetitionCoefficient) return options.mixCompetitionCoefficient;

        crop = this.getCrop(crop);
        
        if(crop?.coefficients.mixCompetition) return crop.coefficients.mixCompetition;

        return 1;
    }

    getDefaultPercentOfSingleSpeciesSeedingRate(crop,options={}){
        if(options?.percentOfRate) return options.percentOfRate;
        
        crop = this.getCrop(crop);

        if(this.isFreezingZone() === true){
            return this.getFreezingZonesDefaultPercentOfSingleSpeciesSeedingRate(crop,options);
        }
        return super.getDefaultPercentOfSingleSpeciesSeedingRate(crop,options);
    }

    getFreezingZonesDefaultPercentOfSingleSpeciesSeedingRate(crop,options={}){
        crop = this.getCrop(crop);

        let group = crop?.group;
        if(group?.label) group = group.label;

        const countSpiecesOfGroupInMix = this.speciesInMix[group];
        return 1/(this.mixDiversity * countSpiecesOfGroupInMix);
    }

}



class Crop {

    static FACTORY_MAP = {
        'mccc': (data) => new MWCrop(data),
        'neccc': (data) => new NECrop(data),
        'sccc': (data) => new SOCrop(data),
    }


    constructor(council, data){
        if(council){
            return Crop.factory(council, data);
        }
        this.raw = data;
    }

    static getFactory(K){
        let factory = this.FACTORY_MAP[K];

        if(factory) return factory;

        return () => {
            return new Crop();
        }
    }

    static factory(council, data){
        if(!council) throw new Error('Council parameter must be provided.');
        if(!data?.id) throw new Error('Invalid Data Structure, Missing Property: id');

        if(!Object.keys(this.FACTORY_MAP).includes(council)){
            throw new Error(`Invalid Council: ${council}`);
        }
        
        council = council.toLowerCase();

        const instance = this.FACTORY_MAP[council](data);
        
        instance.raw = data;
        instance.id = data.id;
        instance.label = data.label;
        instance.group = data?.group?.label;
        instance.calcs = {};

        return instance.init();
    }


    init(){
        return this;
    }

    get(...K){
        let val = this.raw;
        for(let k of K){
            val = val[k]
            if(typeof val === 'undefined') return null;
        }
    }

    validate({prop, checks = [], container, fullPath}){
        const path = prop.key;
        const pathKeys = path.split('.');

        let next = this.raw;
        if(container) next = container;
        for(let key of pathKeys) {
            if(!(typeof next === 'object')) break;

            if(Object.keys(next).includes(key)) next = next[key];
            else if(prop.required) throw new Error(`(${this.label}) Invalid Crop Structure - Missing Attributes: ${fullPath ?? path}`);
        }

        for(let check of checks){
            if(typeof check.validate === 'function'){
                if(!check.validate(next)) throw new Error(`(${this.label}) Failed Check: ${fullPath ?? path} - ${check.summary}`)
            }
        }

        if(typeof next === 'object') return {};
        
        return next;
    }

    validateProps(props, container, fullPath){
        if(!container) container = this.raw;

        if(!Array.isArray(props)){

            if(fullPath) fullPath = `${fullPath}.${props.key}`;
            else fullPath = props.key;

            this.validate({prop:props, checks: props.checks, fullPath, container});
  
            container = container[props.key];

            if(props?.props){
                return this.validateProps(props.props, container, fullPath);
            }
            
            if(props.required && !(container?.values || container.values.length < 1)) {
                throw new Error(`(${this.label}) Invalid Crop Structure - Missing Values: ${fullPath ?? path}`)
            }
            
            if(props?.setter && container?.values?.length >= 1 && typeof props.setter === 'function'){
                props.setter(this, container);
            }
            
            return;
        }

        for(let prop of props){
            this.validateProps(prop,container,fullPath);
        }

    }


    static interpretDateRange(range){
        let dates = range.split(' - ');
        const currentYear = new Date().getFullYear(); 
        const container = [];
        for(let date of dates){
            let segments = date.split('/');

            if(segments.length >= 2){
                date = `${segments[0]}/${segments[1]}`;
            }

            date = new Date(date);
            container.push(date)
        }
        return container;
    }


}


class MWCrop extends Crop {

    constructor(data){
        super();
    }

    static props = [
        {
            key: 'attributes',
            required: true,
            props: [
                {
                    key: 'Coefficients',
                    required: true,
                    props: [
                        {
                            key: 'Single Species Seeding Rate', 
                            required: true, 
                            setter: (inst, val) => inst.coefficients.singleSpeciesSeedingRate = Number(val.values[0])
                        },
                        {
                            key: 'Broadcast Coefficient', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.plantingMethods.broadcast = Number(val.values[0])
                        },
                        {
                            key: 'Aerial Coefficient', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.plantingMethods.aerial = Number(val.values[0])
                        },
                        {
                            key: 'Precision Coefficient', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.plantingMethods.precision = Number(val.values[0])
                        },
                        {
                            key: '% Live Seed to Emergence', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.liveSeedToEmergence = Number(val.values[0])
                        },
                        {
                            key: 'Max % Allowed in Mix',
                            required: false,
                            setter: (inst, val) => inst.coefficients.maxInMix = Number(val.values[0])
                        },
                        {
                            key: '% Chance of Winter Survial', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.chanceWinterSurvival = Number(val.values[0])
                        },
                    ]
                },
                {
                    key: 'Planting Information', 
                    required: true,
                    props: [
                        {
                            key: 'Seed Count', 
                            required: true,
                            setter: (inst, val) => inst.seedsPerPound = Number(val.values[0])
                        },
                        {   
                            key: 'Planting Methods', 
                            required: false, 
                            checks: [{validate: (val) => { return Array.isArray(val.values); }, summary: 'Must be an array.'}],
                            setter: (inst, val) => inst.plantingMethods = val.values
                        },
                    ]
                },
                {
                    key: 'Soil Conditions', 
                    required: true,
                    props: [
                        {
                            key: 'Soil Drainage', 
                            required: true,
                            setter: (inst, val) => inst.soilDrainage = val.values
                        },
                    ]
                },
                {
                    key: 'NRCS', 
                    required: false,
                    props: [
                        {
                            key: 'Single Species Seeding Rate', 
                            required: false,
                            setter: (inst, val) => inst.nrcs.singleSpeciesSeedingRate = Number(val.values[0])
                        },
                    ]
                },
                {
                    key: 'Planting and Growth Windows', 
                    required: false,
                    props: [
                        {   
                            key: 'Reliable Establishment', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.reliableEstablishement = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Freeze/Moisture Risk to Establishment', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.riskToEstablishment = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Early Seeding Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.earlySeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Late Seeding Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.lateSeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Average Frost', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.averageFrost = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                    ]
                },
            ]
        }
    ];

    init(){
        super.init();

        this.coefficients = { plantingMethods: {} };
        this.plantingDates = { }
        this.nrcs = { }
        this.custom = this?.raw?.custom ?? {};

        // validates and sets props.
        this.validateProps(MWCrop.props);

        return this;
    }
    
}

class NECrop extends Crop {

    constructor(data){
        super();
    }

    static props = [
        {
            key: 'attributes',
            required: true,
            props: [
                {
                    key: 'Coefficients',
                    required: true,
                    props: [
                        {
                            key: 'High Fertility Competition Coefficient', 
                            required: false, 
                            setter: (inst, val) => inst.coefficients.highFertilityCompetition = Number(val.values[0])
                        },
                        {
                            key: 'Low Fertility Competition Coefficient', 
                            required: false, 
                            setter: (inst, val) => inst.coefficients.lowFertilityCompetition = Number(val.values[0])
                        },
                        {
                            key: 'High Fertility Monoculture Coefficient', 
                            required: false, 
                            setter: (inst, val) => inst.coefficients.highFertilityMonoculture = Number(val.values[0])
                        },
                        {
                            key: 'Low Fertility Monoculture Coefficient', 
                            required: false, 
                            setter: (inst, val) => inst.coefficients.lowFertilityMonoculture = Number(val.values[0])
                        },
                        {
                            key: 'Single Species Seeding Rate', 
                            required: true, 
                            setter: (inst, val) => inst.coefficients.singleSpeciesSeedingRate = Number(val.values[0])
                        },
                        {
                            key: 'Broadcast with Cultivation Coefficient', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.plantingMethods.broadcastWithCultivation = Number(val.values[0])
                        },
                        {
                            key: 'Broadcast without Cultivation Coefficient', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.plantingMethods.broadcastWithoutCultivation = Number(val.values[0])
                        },
                        {
                            key: 'Aerial Coefficient', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.plantingMethods.aerial = Number(val.values[0])
                        },
                    ]
                },
                {
                    key: 'Planting', 
                    required: true,
                    props: [
                        {
                            key: 'Seeds Per lb', 
                            required: true,
                            setter: (inst, val) => inst.seedsPerPound = Number(val.values[0])
                        },
                        {   
                            key: 'Planting Methods', 
                            required: false, 
                            // checks: [{validate: (val) => { return Array.isArray(val.values); }, summary: 'Must be an array.'}],
                            setter: (inst, val) => inst.plantingMethods = val.values
                        },
                    ]
                },
                {
                    key: 'Soil Conditions', 
                    required: true,
                    props: [
                        {
                            key: 'Soil Drainage', 
                            required: true,
                            checks: [{validate: (val) => { return Array.isArray(val.values); }, summary: 'Must be an array.'}],
                            setter: (inst, val) => inst.soilDrainage = val.values
                        },
                        {
                            key: 'Soil Fertility', 
                            required: false,
                            // checks: [{validate: (val) => { return Array.isArray(val.values); }, summary: 'Must be an array.'}],
                            setter: (inst, val) => inst.soilDrainage = val.values
                        },
                    ]
                },
                {
                    key: 'Planting and Growth Windows', 
                    required: false,
                    props: [
                        {   
                            key: 'Reliable Establishment', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.reliableEstablishement = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Freeze/Moisture Risk to Establishment', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.riskToEstablishment = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Early Seeding Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.earlySeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Late Seeding Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.lateSeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Average Frost', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.averageFrost = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                    ]
                },
            ]
        }
    ];

    init(){
        super.init();

        this.coefficients = { plantingMethods: {} };
        this.plantingDates = { }
        this.custom = this?.raw?.custom ?? {};

        // validates and sets props.
        this.validateProps(NECrop.props);

        return this;
    }

}

class SOCrop extends Crop {

    constructor(data){
        super();
    }

    static props = [
        {
            key: 'attributes',
            required: true,
            props: [
                {
                    key: 'Coefficients',
                    required: true,
                    props: [
                        {
                            key: 'Mix Competition Coefficient', 
                            required: false, 
                            setter: (inst, val) => inst.coefficients.mixCompetition = Number(val.values[0])
                        },
                        {
                            key: 'Broadcast with Cultivation Coefficient', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.plantingMethods.broadcastWithCultivation = Number(val.values[0])
                        },
                        {
                            key: 'Broadcast without Cultivation Coefficient', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.plantingMethods.broadcastWithoutCultivation = Number(val.values[0])
                        },
                        {
                            key: 'Broadcast with Cultivation, No Packing Coefficient', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.plantingMethods.broadcastWithCultivationNoPacking = Number(val.values[0])
                        },
                        {
                            key: 'Aerial Coefficient', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.plantingMethods.aerial = Number(val.values[0])
                        },
                        {
                            key: 'Standard High Fertility Monoculture Coefficient', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.planting.standardHighFertilityMonoculture = Number(val.values[0])
                        },
                        {
                            key: 'Early Fall/Winter Planting Coefficient', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.planting.earlyFall = Number(val.values[0])
                        },
                        {
                            key: 'Late Fall/Winter Planting Coefficient', 
                            required: false,
                            setter: (inst, val) => inst.coefficients.planting.lateFall = Number(val.values[0])
                        },
                    ]
                },
                {
                    key: 'Planting', 
                    required: true,
                    props: [
                        {
                            key: 'Seeds per Pound', 
                            required: true,
                            setter: (inst, val) => inst.seedsPerPound = Number(val.values[0])
                        },
                        {
                            key: 'Default Seeding Method', 
                            required: true,
                            setter: (inst, val) => inst.defaultSeedingMethod = Number(val.values[0])
                        },
                        {
                            key: 'Base Seeding Rate', 
                            required: true, 
                            setter: (inst, val) => inst.coefficients.singleSpeciesSeedingRate = Number(val.values[0])
                        },
                        {
                            key: 'Final Seeding Rate Min', 
                            required: true,
                            setter: (inst, val) => inst.finalSeedingRate.min = Number(val.values[0])
                        },
                        {
                            key: 'Final Seeding Rate Max', 
                            required: true,
                            setter: (inst, val) => inst.finalSeedingRate.max = Number(val.values[0])
                        },
                    ]
                },
                {
                    key: 'Environmental Tolerances', 
                    required: true,
                    props: [
                        {
                            key: 'Soil Drainage', 
                            required: true,
                            checks: [{validate: (val) => { return Array.isArray(val.values); }, summary: 'Must be an array.'}],
                            setter: (inst, val) => inst.soilDrainage = val.values
                        },
                    ]
                },
                {
                    key: 'Planting and Growth Windows', 
                    required: false,
                    props: [
                        {   
                            key: 'Reliable Establishment', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.reliableEstablishement = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Freeze/Moisture Risk to Establishment', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.riskToEstablishment = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Early Spring Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.earlySpringSeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Late Fall/Winter Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.lateFallSeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Early Fall/Winter Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.earlyFallSeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Standard Summer Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.standardSummerSeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Standard Spring Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.standardSpringSeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Standard Fall/Winter Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.standardFallSeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Average Frost', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.averageFrost = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                    ]
                },
            ]
        }
    ];

    init(){
        super.init();

        this.coefficients = { plantingMethods: {}, planting: {} };
        this.plantingDates = { };
        this.finalSeedingRate = {};
        this.custom = this?.raw?.custom ?? {};

        // validates and sets props.
        this.validateProps(SOCrop.props);

        return this;
    }

}

// Make the SDK available to applications that load this file with a <script> tag.
Object.assign(globalThis, {
    Options,
    NRCS,
    SeedRateCalculator,
    MWSeedRateCalculator,
    NESeedRateCalculator,
    SOSeedRateCalculator,
    Crop,
    MWCrop,
    NECrop,
    SOCrop,
});


