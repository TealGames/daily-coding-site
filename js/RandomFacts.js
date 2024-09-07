export function getFacts()
{
    const funFactPrefix= "Fun Fact: ";
    const facts= [
        "Ada Lovelace, a mathematician, is often credited as the first computer programmer for her work on Charles Babbage\'s Analytical Engine.",
        "\"Hello, World!\" is a traditional first program to demonstrate basic syntax and functionality when learning a new programming language.",
        "The term \"bug\" originated in 1947 when a moth caused a computer malfunction. Grace Hopper and her team coined the term “debugging” when they removed the insect.",
        "Brainf*ck is a minimalistic programming language with only eight commands, yet it is Turing complete, capable of performing any computation.",
        "Computer scientist Scott Fahlman coined the first emoticon, 🙂 , in 1982, to convey humor in an online post.",
        "Python, a programming language, is named after the British comedy group Monty Python",
        "Linux, developed by Linus Torvalds, is an open-source operating system kernel that has influenced embedded systems, smartphones, and supercomputers.",
        "The QR code (Quick Response code) was developed by Denso Wave in 1994. Its design, with black squares on a white background, enhances readability and error correction",
        "Fortran (FORmula TRANslation) was the first coding language created by John Backus and his team at IBM in the 1950s.",
        "ADA is a coding language built in 1980 that is used by the International Space Station.",
        "Alan Turing invented the \"Turing Test\" (one of the Turing tests is CAPTCHA) to help identify humans from computers.",
        "Dennis Ritchie created the \"C\" language by improving the \"B\" language",
        "There are around 700 separate programming languages",
        "According to many online studies, the most disliked programming languages are Perl, Delphi, and VBA",
        "Alan Turing is predominantly recognized as the father of modern-day computer science.",
        "NASA\'s reusable space shuttle in the 1970s had less code than our phones today",
        "The average coder writes 10 to 12 lines of code every day.",
        "According to recent statistics, the average age of a software developer is 36 years.",
        "JavaScript has nothing to do with Java and was only named that way to build off of the hype of Java\'s release at that time",
        "Python overtook French and became the most popular language taught in elementary schools.",
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