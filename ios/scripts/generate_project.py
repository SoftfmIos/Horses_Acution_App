#!/usr/bin/env python3
"""Generate the dependency-free Xcode project; deterministic IDs keep diffs reviewable."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OBJECTS = {}

def ident(value): return hashlib.sha1(value.encode()).hexdigest()[:24].upper()
def q(value): return json.dumps(str(value), ensure_ascii=False)
def array(values): return '(' + ', '.join(values) + (',' if values else '') + ')'
def add(key, isa, **properties):
    ref = ident(key)
    OBJECTS[ref] = (isa, properties)
    return ref

def file(key, path, kind): return add(key, 'PBXFileReference', lastKnownFileType=q(kind), path=q(path), sourceTree=q('<group>'))

sources = sorted((ROOT/'RiyadhPoloHills').rglob('*.swift'))
tests = sorted((ROOT/'RiyadhPoloHillsTests').glob('*.swift'))
source_refs = [file('source:'+str(p.relative_to(ROOT)),str(p.relative_to(ROOT/'RiyadhPoloHills')),'sourcecode.swift') for p in sources]
test_refs = [file('test:'+p.name,p.name,'sourcecode.swift') for p in tests]
fixtures = sorted((ROOT/'RiyadhPoloHillsTests'/'Fixtures').glob('*.json'))
fixture_refs = [file('fixture:'+p.name,'Fixtures/'+p.name,'text.json') for p in fixtures]
asset = file('assets','Resources/Assets.xcassets','folder.assetcatalog')
privacy = file('privacy','Resources/PrivacyInfo.xcprivacy','text.xml')
info = file('info','Resources/Info.plist','text.plist.xml')
config = file('config','Configuration/App.xcconfig','text.xcconfig')
app_product = add('app-product','PBXFileReference',explicitFileType=q('wrapper.application'),includeInIndex='0',path=q('RiyadhPoloHills.app'),sourceTree=q('BUILT_PRODUCTS_DIR'))
test_product = add('test-product','PBXFileReference',explicitFileType=q('wrapper.cfbundle'),includeInIndex='0',path=q('RiyadhPoloHillsTests.xctest'),sourceTree=q('BUILT_PRODUCTS_DIR'))

def build(key, refs, isa):
    files = [add(key+':'+ref,'PBXBuildFile',fileRef=ref) for ref in refs]
    return add(key,isa,buildActionMask='2147483647',files=array(files),runOnlyForDeploymentPostprocessing='0')
app_sources = build('app-sources',source_refs,'PBXSourcesBuildPhase')
resources = build('app-resources',[asset,privacy],'PBXResourcesBuildPhase')
frameworks = build('app-frameworks',[],'PBXFrameworksBuildPhase')
test_sources = build('test-sources',test_refs,'PBXSourcesBuildPhase')
test_resources = build('test-resources',fixture_refs,'PBXResourcesBuildPhase')
test_frameworks = build('test-frameworks',[],'PBXFrameworksBuildPhase')
source_group = add('source-group','PBXGroup',children=array(source_refs+[asset,privacy,info]),path=q('RiyadhPoloHills'),sourceTree=q('<group>'))
test_group = add('test-group','PBXGroup',children=array(test_refs+fixture_refs),path=q('RiyadhPoloHillsTests'),sourceTree=q('<group>'))
products = add('products','PBXGroup',children=array([app_product,test_product]),name=q('Products'),sourceTree=q('<group>'))
root_group = add('root-group','PBXGroup',children=array([source_group,test_group,config,products]),sourceTree=q('<group>'))

project_id,app_id,test_id = ident('project'),ident('app-target'),ident('test-target')
def settings(**kwargs): return '{ '+ ' '.join(f'{k} = {v};' for k,v in kwargs.items())+' }'
def config_list(prefix, settings_dict, base=None):
    refs=[]
    for name in ['Debug','Release']:
        values = dict(settings_dict)
        values['SWIFT_OPTIMIZATION_LEVEL'] = q('-Onone' if name=='Debug' else '-O')
        if name=='Debug': values['ENABLE_TESTABILITY']='YES'
        properties = {'buildSettings': settings(**values), 'name':q(name)}
        if base: properties['baseConfigurationReference']=base
        refs.append(add(prefix+name,'XCBuildConfiguration',**properties))
    return add(prefix+'list','XCConfigurationList',buildConfigurations=array(refs),defaultConfigurationIsVisible='0',defaultConfigurationName=q('Release'))
project_configs = config_list('project-config',{'CLANG_ENABLE_MODULES':'YES','SDKROOT':q('iphoneos'),'IPHONEOS_DEPLOYMENT_TARGET':q('17.0'),'SWIFT_VERSION':q('5.0'),'CLANG_ENABLE_OBJC_ARC':'YES'})
app_configs = config_list('app-config',{'PRODUCT_NAME':q('$(TARGET_NAME)'),'INFOPLIST_FILE':q('RiyadhPoloHills/Resources/Info.plist'),'GENERATE_INFOPLIST_FILE':'NO','TARGETED_DEVICE_FAMILY':q('1,2'),'ASSETCATALOG_COMPILER_APPICON_NAME':q('AppIcon'),'SUPPORTED_PLATFORMS':q('iphoneos iphonesimulator'),'SUPPORTS_MACCATALYST':'NO','SWIFT_EMIT_LOC_STRINGS':'NO'},config)
test_configs = config_list('test-config',{'PRODUCT_NAME':q('$(TARGET_NAME)'),'PRODUCT_BUNDLE_IDENTIFIER':q('com.riyadhpolohills.academy.tests'),'GENERATE_INFOPLIST_FILE':'YES','TARGETED_DEVICE_FAMILY':q('1,2'),'TEST_HOST':q('$(BUILT_PRODUCTS_DIR)/RiyadhPoloHills.app/RiyadhPoloHills'),'BUNDLE_LOADER':q('$(TEST_HOST)'),'CODE_SIGN_STYLE':q('Automatic')})
proxy=add('test-proxy','PBXContainerItemProxy',containerPortal=project_id,proxyType='1',remoteGlobalIDString=app_id,remoteInfo=q('RiyadhPoloHills'))
dependency=add('test-dependency','PBXTargetDependency',target=app_id,targetProxy=proxy)
add('app-target','PBXNativeTarget',buildConfigurationList=app_configs,buildPhases=array([app_sources,frameworks,resources]),buildRules='()',dependencies='()',name=q('RiyadhPoloHills'),productName=q('RiyadhPoloHills'),productReference=app_product,productType=q('com.apple.product-type.application'))
add('test-target','PBXNativeTarget',buildConfigurationList=test_configs,buildPhases=array([test_sources,test_frameworks,test_resources]),buildRules='()',dependencies=array([dependency]),name=q('RiyadhPoloHillsTests'),productName=q('RiyadhPoloHillsTests'),productReference=test_product,productType=q('com.apple.product-type.bundle.unit-test'))
add('project','PBXProject',attributes='{ BuildIndependentTargetsInParallel = YES; LastUpgradeCheck = 1600; TargetAttributes = { '+app_id+' = {CreatedOnToolsVersion = 16.0; }; '+test_id+' = {CreatedOnToolsVersion = 16.0; TestTargetID = '+app_id+'; }; }; }',buildConfigurationList=project_configs,compatibilityVersion=q('Xcode 14.0'),developmentRegion=q('en'),hasScannedForEncodings='0',knownRegions=array([q('en'),q('ar'),q('Base')]),mainGroup=root_group,productRefGroup=products,projectDirPath=q(''),projectRoot=q(''),targets=array([app_id,test_id]))
project = ROOT/'RiyadhPoloHills.xcodeproj'
project.mkdir(exist_ok=True)
lines=['// !$*UTF8*$!','{','archiveVersion = 1;','classes = {};','objectVersion = 56;','objects = {']
for ref,(isa,props) in sorted(OBJECTS.items()):
    lines.append(f'{ref} = {{ isa = {isa};')
    lines.extend(f'  {key} = {value};' for key,value in props.items())
    lines.append('};')
lines.extend(['};','rootObject = '+project_id+';','}'])
(project/'project.pbxproj').write_text('\n'.join(lines)+'\n')
schemes=project/'xcshareddata/xcschemes';schemes.mkdir(parents=True,exist_ok=True)
def build_ref(ref,name): return f'<BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="{ref}" BuildableName="{name}" BlueprintName="{name.split(".")[0]}" ReferencedContainer="container:RiyadhPoloHills.xcodeproj"/>'
(schemes/'RiyadhPoloHills.xcscheme').write_text(f'''<?xml version="1.0" encoding="UTF-8"?>
<Scheme LastUpgradeVersion="1600" version="1.3">
<BuildAction parallelizeBuildables="YES" buildImplicitDependencies="YES"><BuildActionEntries><BuildActionEntry buildForTesting="YES" buildForRunning="YES" buildForProfiling="YES" buildForArchiving="YES" buildForAnalyzing="YES">{build_ref(app_id,'RiyadhPoloHills.app')}</BuildActionEntry><BuildActionEntry buildForTesting="YES" buildForRunning="NO" buildForProfiling="NO" buildForArchiving="NO" buildForAnalyzing="NO">{build_ref(test_id,'RiyadhPoloHillsTests.xctest')}</BuildActionEntry></BuildActionEntries></BuildAction>
<TestAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.IDEFoundation.Launcher.LLDB" shouldUseLaunchSchemeArgsEnv="YES"><Testables><TestableReference skipped="NO">{build_ref(test_id,'RiyadhPoloHillsTests.xctest')}</TestableReference></Testables></TestAction>
<LaunchAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.IDEFoundation.Launcher.LLDB" launchStyle="0" useCustomWorkingDirectory="NO" ignoresPersistentStateOnLaunch="NO" debugDocumentVersioning="YES" debugServiceExtension="internal" allowLocationSimulation="YES"><BuildableProductRunnable runnableDebuggingMode="0">{build_ref(app_id,'RiyadhPoloHills.app')}</BuildableProductRunnable></LaunchAction>
<ProfileAction buildConfiguration="Release" shouldUseLaunchSchemeArgsEnv="YES" savedToolIdentifier="" useCustomWorkingDirectory="NO" debugDocumentVersioning="YES"><BuildableProductRunnable runnableDebuggingMode="0">{build_ref(app_id,'RiyadhPoloHills.app')}</BuildableProductRunnable></ProfileAction>
<AnalyzeAction buildConfiguration="Debug"/><ArchiveAction buildConfiguration="Release" revealArchiveInOrganizer="YES"/>
</Scheme>
''')
print(f'Generated {len(sources)} Swift sources and {len(tests)} test sources.')
