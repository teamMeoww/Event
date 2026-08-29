import Morph from '@/components/molecules/Morph'
import ProjectCard from '@/components/molecules/ProjectCard'
import ServiceCard from '@/components/molecules/ServiceCard'
import Footer from '@/components/organisms/Footer'
import Hero from '@/components/organisms/Hero'
import StudioFullPage from '@/components/organisms/TrustedBy'
import CTA from '@/components/molecules/CTA'
import React from 'react'

const Home = () => {
    return (
        <div>
            <Hero />
            <StudioFullPage />
            <ServiceCard />
            <ProjectCard />
            <CTA />
            <Footer />
        </div>
    )
}

export default Home
