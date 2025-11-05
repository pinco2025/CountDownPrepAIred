const Contact = () => {
    return (
        <div className="w-full">
            <div className="max-w-4xl w-full px-4 mx-auto text-center">
                <div className="animate-fadeIn">
                    <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                        Get In Touch
                    </h1>
                    <p className="mt-4 mb-10 text-lg text-text-secondary-light dark:text-text-secondary-dark">
                        We're here to help and answer any question you might have. We look forward to hearing from you!
                    </p>
                </div>
                <div className="flex justify-center animate-fadeIn animate-delay-300">
                    <a href="mailto:help.prepaired@gmail.com" className="w-full md:w-1/3">
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/20 transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-primary/10 rounded-full">
                                <span className="material-icons-outlined text-3xl text-primary">email</span>
                            </div>
                            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark">Email Us</h3>
                            <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">help.prepaired@gmail.com</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Contact;
