export function getFacts()
{
    const funFactPrefix= "Fun Fact: ";
    const facts= [
        "The first computer programmer was a lady named 'Ada Lovelace'.",
        "The first computer virus was created in 1982 by a 15-year-old kid."
    ];

    for (let i=0; i<facts.length; i++)
    {
        if (facts[i].substring(0, funFactPrefix.length)!==funFactPrefix)
        {
            facts[i]= funFactPrefix+facts[i];
        }
    }
    return facts;
}