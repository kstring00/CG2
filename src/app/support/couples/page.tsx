import MarriageClosing from '@/components/marriage/Closing';
import MarriageFooter from '@/components/marriage/Footer';
import MarriageHeader from '@/components/marriage/Header';
import MarriageHero from '@/components/marriage/Hero';
import MarriageIntro from '@/components/marriage/Intro';
import MarriageReconnectTool from '@/components/marriage/ReconnectTool';
import MarriageResources from '@/components/marriage/Resources';
import MarriageTruths from '@/components/marriage/Truths';

export default function CouplesMarriagePage() {
  return (
    <>
      <MarriageHeader />
      <main>
        <MarriageHero />
        <MarriageIntro />
        <MarriageTruths />
        <MarriageReconnectTool />
        <MarriageResources />
        <MarriageClosing />
      </main>
      <MarriageFooter />
    </>
  );
}
